// const $ = require('jquery');
import {square} from 'test';

const test = [1, 2, 3];
const [a, b, c] = test;

function test() {
  console.log(square(a) + square(b) + square(c));
}

test();
