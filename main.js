const disableLink = (itemId) => {
  const navItem = document.querySelectorAll(itemId);
  navItem.forEach((item) => {
    item.classList.remove("active");
  });
};
const activeLink = (itemId, linkId) => {
  const navItem = document.querySelectorAll(itemId),
    navLink = document.querySelectorAll(linkId);

  navLink.forEach((item, index) => {
    item.addEventListener("click", () => {
      disableLink(itemId);
      navItem[index].classList.add("active");
    });
  });
};

activeLink(".nav-item", ".nav-link");

const themeBtn = document.getElementById("theme");

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
});
