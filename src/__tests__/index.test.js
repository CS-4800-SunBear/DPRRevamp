//import {describe} from '@jest/globals'
import {jest} from 'jest';

const getClasses = require('../fetch');


test('courses array is not empty', ()=>{
  const x = 0; 
  const size = getClasses.length
  expect(size).not.toBe(x); 
  //When no courses appear the array is empty, since the comparison fails
  //the array must have classes
})