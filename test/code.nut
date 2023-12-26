//-------------------------------------------------------------------------------------//
// This code was automatically generated using VJScript.
// VJScript is an automatic code translation tool from JavaScript to Squirrel
// https://github.com/MoonlyDays/VJScript
//-------------------------------------------------------------------------------------//
// Source Script Name: code.js
// Compile Time: Tue Dec 26 2023 02:28:57 GMT+0200 (Eastern European Standard Time)
// VJScript Version: 0.1.0
//-------------------------------------------------------------------------------------//

const const_int_declare = 1
const const_float_declare = 1.2
const const_string_declare = "const"
local const_expr_that_should_be_local = ("a" + 1)
const const_with_multiple_declarators = 3
const second_const_in_same_declarator = 2
local single_let_declaration = "test"
local multiple_let_declarations = 2, second_let_declaration = 885
local array = [const_int_declare, const_float_declare, const_string_declare, const_expr_that_should_be_local]
local i = array[1]
local test1 = array[0], test2 = array[1]
local _tmp = array
test1 = _tmp[0]
test2 = _tmp[1]
local forDeclared, forDeclared2, forDeclared3
foreach (item in array) {
}
foreach (forDeclared in array) {
}
foreach (idx, _tmp2 in array) {
}
foreach (forDeclared, _tmp3 in array) {
}
foreach (idx, _tmp4 in array) {
}
foreach (forDeclared, _tmp5 in array) {
}
foreach (k, v in array) {
}
foreach (forDeclared, forDeclared2 in array) {
}
function declared_named_function (arg) {
}
local declared_unnamed_function = function () {
}
local declared_lambda_function = function () {
}
declared_named_function(declared_unnamed_function)
declared_unnamed_function(function () {
})
declared_named_function(function () {
})
declared_unnamed_function(function () {
  return (123 + 123)
})
