const const_int_declare = 1;
const const_float_declare = 1.2;
const const_string_declare = 'const';
const const_expr_that_should_be_local = 'a' + 1;
const const_with_multiple_declarators = 3, second_const_in_same_declarator = 2;
let single_let_declaration = 'test';
let multiple_let_declarations = 2, second_let_declaration = 885;

const array = [
    const_int_declare,
    const_float_declare,
    const_string_declare,
    const_expr_that_should_be_local
];

const i = array[1];
let [test1, test2] = array;
[test1, test2] = array;

let forDeclared, forDeclared2, forDeclared3;
for (const item of array) {}
for (forDeclared of array) {}
for (const idx in array) {}
for (forDeclared in array) {}
for (const [idx] in array) {}
for ([forDeclared] in array) {}
for (const [k, v] in array) {}
for ([forDeclared, forDeclared2] in array) {}

function declared_named_function(arg) {}
const declared_unnamed_function = function () {};
const declared_lambda_function = () => {};
declared_named_function(declared_unnamed_function);
declared_unnamed_function(function inline_named_function() {});
declared_named_function(function inline_unnamed_function() {});
declared_unnamed_function(() => {});