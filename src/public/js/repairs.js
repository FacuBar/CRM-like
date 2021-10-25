const headerSearch = document.querySelector('.header__search');
const searchQuery = document.querySelector('#search');

headerSearch.addEventListener('submit', (e) => {
  e.preventDefault();

  window.location.href = `/repairs?search=${searchQuery.value}`;
});
