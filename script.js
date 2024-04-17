// script.js
document.addEventListener("DOMContentLoaded", () => {
  const domainList = document.querySelector(".domain-list");
  const sortSelect = document.querySelector(".sort-select");
  const searchInput = document.querySelector(".search-input");

  fetch("domains.json")
    .then((response) => response.json())
    .then((data) => {
      let domains = data;

      function renderDomainCards() {
        domainList.innerHTML = "";

        domains.forEach((domain) => {
          const domainCard = document.createElement("div");
          domainCard.classList.add("domain-card");

          const domainName = document.createElement("h3");
          domainName.classList.add("domain-name");
          domainName.textContent = domain.name;
          domainCard.appendChild(domainName);

          const domainPrice = document.createElement("p");
          domainPrice.classList.add("domain-price");
          domainPrice.textContent = `$${domain.price}`;
          domainCard.appendChild(domainPrice);

          const domainBlurb = document.createElement("p");
          domainBlurb.classList.add("domain-blurb");
          domainBlurb.textContent = domain.blurb;
          domainCard.appendChild(domainBlurb);

          if (domain.minOffer) {
            const makeOfferLink = document.createElement("a");
            makeOfferLink.classList.add("make-offer-link");
            makeOfferLink.href = `https://example.com/offer?domain=${domain.name}&min_offer=${domain.minOffer}`;
            makeOfferLink.textContent = "Make an Offer";
            domainCard.appendChild(makeOfferLink);
          }

          const shareButton = document.createElement("button");
          shareButton.classList.add("share-button");
          shareButton.textContent = "Share";
          shareButton.addEventListener("click", () => {
            // Implement share functionality here
            alert(`Sharing domain: ${domain.name}`);
          });
          domainCard.appendChild(shareButton);

          domainList.appendChild(domainCard);
        });
      }

      function sortDomains() {
        const selectedOption = sortSelect.value;
        if (selectedOption === "price") {
          domains.sort((a, b) => a.price - b.price);
        } else if (selectedOption === "name") {
          domains.sort((a, b) => a.name.localeCompare(b.name));
        }
        renderDomainCards();
      }

      function searchDomains() {
        const searchTerm = searchInput.value.toLowerCase();
        domains = data.filter((domain) =>
          domain.name.toLowerCase().includes(searchTerm)
        );
        renderDomainCards();
      }

      sortSelect.addEventListener("change", sortDomains);
      searchInput.addEventListener("input", searchDomains);

      renderDomainCards();
    })
    .catch((error) => {
      console.log("Error fetching domain data:", error);
    });
});
