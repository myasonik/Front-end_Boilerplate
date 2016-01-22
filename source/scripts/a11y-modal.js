/**
 * Example Use:
 * <button data-modal='myModal'>Open Modal</button>
 * <section id='myModal'>
 *   <h1>Modal title</h1>
 *   <button data-modal-close>Close modal</button>
 * </section>
 */

const $ = require('jquery');
const isTabbable = require('./utils/isTabbable');
// const keycodes = require('./utils/keycodes');

let refocusTarget;

function getLastTabbable($modal) {
    const allEls = $modal.find('*').get();
    let lastTabbable = allEls.pop();

    while (lastTabbable && !isTabbable(lastTabbable)) lastTabbable = allEls.pop();

    return $(lastTabbable);
}

function setup($modalOpenBtns) {
    $modalOpenBtns.each((i, el) => {
        const $btn = $(el);
        const modalId = $btn.attr('data-modal');
        const $modal = $(`#${modalId}`);
        const $modalTitle = $modal.find('h1');
        const modalOptions = {
            tabindex: 0,
            role: 'dialog',
            'aria-hidden': true
        };

        if (!$modalTitle.length) {
            if (!$modal.attr('aria-label') || !$modal.attr('aria-labelledby')) {
                throw new Error('Modals must have a title. An h1 inside the modal or aria-label or aria-labelledby on the modal will work.');
            }
        } else {
            const modalTitleId = `${modalId}-title`;
            $modalTitle.attr('id', modalTitleId);
            modalOptions['aria-labelledby'] = modalTitleId;
        }

        $modal
            .attr(modalOptions).addClass('is-closed')
            .children().wrapAll('<div role="document></div>"');
    });

    $modalCloseBtns.attr('type', 'button');
}

function closeModal() {
    refocusTarget.focus();
}

module.exports = function() {
    const $modalOpenBtns = $('[data-modal]');
    const $modalCloseBtns = $('[data-modal-close]');

    setup($modalOpenBtns, $modalCloseBtns);
    $modalOpenBtns.click((e) => {
        debugger;
        const $modal = $(`#${$(e.target).attr('data-modal')}`);
        let $lastTabbable = $modal.find('[data-modal-last-tab]');

        $modal.attr('aria-hidden', false).removeClass('is-closed').focus();

        if (!$lastTabbable.length) {
            $lastTabbable = getLastTabbable($modal);

            if (!$lastTabbable.length) {
                throw new Error('Modals must have a tabbable way to close them. A button is probably the way to do it.');
            }

            $lastTabbable.attr('data-modal-last-tab', '');
        }

        refocusTarget = document.activeElement;
    });

    $modalCloseBtns.click(closeModal);
};
