const MOBILE_BREAKPOINT = 768;
const MOBILE_DEFAULT_ITEMS = 3;

const isMobile = () => window.innerWidth <= MOBILE_BREAKPOINT;
const normalize = (value) => value.trim().toLowerCase();

const newsGrid = document.getElementById('newsGrid');
const categorySelect = document.getElementById('newsCategorySelect');
const categoryList = document.getElementById('newsCategoryList');

if (newsGrid && categorySelect) {
  const cards = Array.from(newsGrid.querySelectorAll('.news-card'));
  const updateSelectAccent = () => {
    categorySelect.classList.toggle('is-all-selected', categorySelect.value === 'all');
  };

  const sortedCards = [...cards].sort((a, b) => {
    const aDate = new Date(a.dataset.date || 0).getTime();
    const bDate = new Date(b.dataset.date || 0).getTime();
    return bDate - aDate;
  });

  sortedCards.forEach((card) => newsGrid.appendChild(card));

  const categories = Array.from(
    new Set(
      sortedCards
        .map((card) => card.querySelector('.tag')?.textContent || '')
        .map((tag) => tag.trim())
        .filter(Boolean)
    )
  );

  categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = normalize(category);
    option.textContent = category;
    categorySelect.appendChild(option);

    if (categoryList) {
      const item = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.category = normalize(category);
      button.textContent = category;
      item.appendChild(button);
      categoryList.appendChild(item);
    }
  });

  const setActiveButton = (value) => {
    if (!categoryList) return;
    categoryList.querySelectorAll('button').forEach((button) => {
      button.classList.toggle('active', button.dataset.category === value);
    });
  };

  const applyFilter = () => {
    updateSelectAccent();
    const selected = categorySelect.value;
    setActiveButton(selected);
    let shownCount = 0;

    sortedCards.forEach((card) => {
      const cardTag = normalize(card.querySelector('.tag')?.textContent || '');
      const matchesCategory = selected === 'all' || cardTag === selected;
      const mobileLimitReached = isMobile() && shownCount >= MOBILE_DEFAULT_ITEMS;

      if (matchesCategory && !mobileLimitReached) {
        card.style.display = '';
        shownCount += 1;
      } else {
        card.style.display = 'none';
      }
    });
  };

  categorySelect.addEventListener('change', applyFilter);
  categoryList?.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-category]');
    if (!button) return;
    categorySelect.value = button.dataset.category;
    applyFilter();
  });
  window.addEventListener('resize', applyFilter);
  applyFilter();
}
