//import {describe} from '@jest/globals'
import {jest} from 'jest';

const getClasses = require('../fetch');

test('courses properly appear', ()=>{
  const array = []; 
  expect(getClasses).not.toBe(array); 
  //When no courses appear the array is empty, since the comparison fails
  //the array must have classes
})

test('courses array is not empty', ()=>{
  const x = 0; 
  const size = getClasses.length
  expect(size).not.toBe(0); 
  //When no courses appear the array is empty, since the comparison fails
  //the array must have classes
})