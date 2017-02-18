const URL_CONFIGURATIONS = [{
    url: '/LT/koncertai',
    categoryId: 2,
    localCategory: 1
}, {
    url: '/LT/sportas',
    categoryId: 3,
    localCategory: 2
}, {
    url: '/LT/teatras_ir_menai',
    categoryId: 4,
    localCategory: 3
}, {
    url: '/LT/seimai',
    categoryId: 5,
    localCategory: 4
}, {
    url: '/LT/festivaliai',
    categoryId: 51,
    localCategory: 5
}, {
    url: '/LT/kinas',
    categoryId: 52,
    localCategory: 6
}, {
    url: '/LT/seminarai',
    categoryId: 65,
    localCategory: 7
}];

const BASE_URL = 'http://www.tiketa.lt';
const NEXT_PAGE_URL = '/LT/Index/NextPage';

module.exports = {
    URL_CONFIGURATIONS: URL_CONFIGURATIONS,
    BASE_URL: BASE_URL,
    NEXT_PAGE_URL: NEXT_PAGE_URL
};