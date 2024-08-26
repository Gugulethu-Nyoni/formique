export function handleDynamicSingleSelect(category) {
  // Hide all subcategory divs
  document.querySelectorAll('[id$="-options"]').forEach(div => {
    div.style.display = "none";
  });

  // Show the selected category
  const selectedCategoryFieldset = document.getElementById(`${category}-options`);
  if (selectedCategoryFieldset) {
    selectedCategoryFieldset.style.display = "block";
  }
}

window.handlerDynamicSingleSelect = handleDynamicSingleSelect;