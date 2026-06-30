/* assets/js/portfolio.js */
document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  if (filterButtons.length === 0 || portfolioItems.length === 0) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // 1. Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // 2. Add active class to clicked button
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      // 3. Filter items
      portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');

        if (filterValue === 'all' || filterValue === itemCategory) {
          item.classList.remove('hidden');
          item.classList.add('visible');
        } else {
          item.classList.remove('visible');
          item.classList.add('hidden');
        }
      });
    });
  });
});
