// script.js
document.addEventListener("DOMContentLoaded", () => {
  const domainList = document.querySelector(".domain-list");
  const sortSelect = document.querySelector(".sort-select");
  const searchInput = document.querySelector(".search-input");
  const tldSection = document.querySelector(".tld-section");
  const manualTlds = [
    "ai",
    "com",
    "app",
    "io",
    "tech",
    "chat",
    "codes",
    "technology",
    "dev",
    "expert",
    "consulting",
    "pro",
    "tips",
    "guide",
    "blog",
    "news",
    "cloud",
    "online",
    "data",
    "software",
    "systems",
    "engineering",
    "solutions",
    "academy",
    "camp",
    "courses",
    "how",
    "space",
    "ninja",
    "me",
    "run",
    "observer",
    "store",
    "games",
    "productions",
    "gallery",
    "reviews",
    "university",
    "builders",
    "contractors",
    "online",
    "solutions",
  ];

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

          // Calculate original price
          const originalPrice = parseFloat(domain.price) * 1.75;
          const formattedOriginalPrice = originalPrice.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          });

          // Current price
          const price = parseFloat(domain.price);
          const formattedPrice = price.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          });

          const domainPrice = document.createElement("div");
          domainPrice.classList.add("domain-price-container");

          const originalPriceElement = document.createElement("span");
          originalPriceElement.classList.add("original-price");
          originalPriceElement.textContent = formattedOriginalPrice;

          const currentPriceElement = document.createElement("span");
          currentPriceElement.classList.add("current-price");
          currentPriceElement.textContent = formattedPrice;

          domainPrice.appendChild(originalPriceElement);
          domainPrice.appendChild(currentPriceElement);
          domainCard.appendChild(domainPrice);

          const domainBlurb = document.createElement("p");
          domainBlurb.classList.add("domain-blurb");
          domainBlurb.textContent = domain.blurb;
          domainCard.appendChild(domainBlurb);

          // Actions container
          const actionsContainer = document.createElement("div");
          actionsContainer.classList.add("actions-container");

          // Buy Now link
          const buyNowLink = document.createElement("a");
          buyNowLink.classList.add("buy-now-link");
          buyNowLink.href = `https://${domain.name}`;
          buyNowLink.target = "_blank";
          buyNowLink.textContent = "Buy Now";
          actionsContainer.appendChild(buyNowLink);

          // Make Offer link
          if (domain.minOffer) {
            const makeOfferLink = document.createElement("a");
            makeOfferLink.classList.add("make-offer-link");
            makeOfferLink.href = `https://${domain.name}`;
            makeOfferLink.target = "_blank";
            makeOfferLink.textContent = "Make an Offer";
            actionsContainer.appendChild(makeOfferLink);
          }

          // Share button
          const shareButton = document.createElement("button");
          shareButton.classList.add("share-button");
          shareButton.textContent = "Share";
          shareButton.addEventListener("click", () => {
            openShareModal(domain.name);
          });
          actionsContainer.appendChild(shareButton);

          domainCard.appendChild(actionsContainer);
          domainList.appendChild(domainCard);
        });
      }

      function openShareModal(domainName) {
        const shareModal = document.getElementById("share-modal");
        const shareLink = document.getElementById("share-link");
        const copyLink = document.getElementById("copy-link");
        const closeButton = document.querySelector(".close");
        const shareTwitter = document.querySelector(".share-twitter");
        const shareFacebook = document.querySelector(".share-facebook");
        const shareLinkedIn = document.querySelector(".share-linkedin");

        const shareUrl = `https://${domainName}`;
        const encodedShareUrl = encodeURIComponent(shareUrl);
        const shareText = encodeURIComponent(
          "Check out this AI domain for sale: "
        );

        shareTwitter.href = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodedShareUrl}`;
        shareFacebook.href = `https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`;
        shareLinkedIn.href = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedShareUrl}`;

        shareLink.value = shareUrl;

        shareModal.style.display = "block";

        closeButton.onclick = () => {
          shareModal.style.display = "none";
        };

        window.onclick = (event) => {
          if (event.target === shareModal) {
            shareModal.style.display = "none";
          }
        };

        copyLink.onclick = () => {
          shareLink.select();
          document.execCommand("copy");
          alert("Link copied to clipboard!");
        };
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

      const ctaButton = document.querySelector(".cta-button");
      ctaButton.addEventListener("click", (event) => {
        event.preventDefault();
        const featuredDomainsSection =
          document.getElementById("featured-domains");
        featuredDomainsSection.scrollIntoView({ behavior: "smooth" });
      });

      // Read the tlds.txt file and create clickable tags
      fetch("tlds.txt")
        .then((response) => response.text())
        .then((data) => {
          const tlds = data.split("\n");
          const tldTags = document.getElementById("tld-tags");

          manualTlds.forEach((tld) => {
            const tag = document.createElement("span");
            tag.classList.add("tld-tag");
            tag.textContent = tld;
            tag.addEventListener("click", () => {
              tag.classList.toggle("selected");
              filterDomains();
            });
            tldTags.appendChild(tag);
          });

          const otherTag = document.createElement("span");
          otherTag.classList.add("tld-tag");
          otherTag.textContent = "Other";
          otherTag.addEventListener("click", () => {
            otherTag.classList.toggle("selected");
            filterDomains();
          });
          tldTags.appendChild(otherTag);
        });
      function filterDomains() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedTlds = Array.from(
          document.querySelectorAll(".tld-tag.selected")
        ).map((tag) => tag.textContent);
        const isOtherSelected = selectedTlds.includes("Other");

        // Adjusting how domains are filtered based on the TLD and search term.
        domains = data.filter((domain) => {
          const domainTld = domain.name.split(".").pop(); // Extracts the TLD from the domain name.
          const isSearchMatch = domain.name.toLowerCase().includes(searchTerm); // Checks if the domain name includes the search term.

          // Determines if the TLD of the domain matches any selected TLD tags, or the 'Other' tag is selected and the TLD is not in manualTlds.
          const isTldMatch =
            selectedTlds.length === 0 ||
            selectedTlds.includes(domainTld) ||
            (isOtherSelected && !manualTlds.includes(domainTld));

          return isSearchMatch && isTldMatch;
        });

        renderDomainCards(); // Updates the display of domains.

        // Optionally, hide or show the TLD section based on the presence of domains.
        tldSection.style.display = domains.length === 0 ? "none" : "block";
      }

      renderDomainCards();
    })
    .catch((error) => {
      console.log("Error fetching domain data:", error);
    });
});
