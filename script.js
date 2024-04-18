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

          const price = parseFloat(domain.price);
          const formattedPrice = price.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          });
          const domainPrice = document.createElement("p");
          domainPrice.classList.add("domain-price");
          domainPrice.textContent = formattedPrice;
          domainCard.appendChild(domainPrice);

          const domainBlurb = document.createElement("p");
          domainBlurb.classList.add("domain-blurb");
          domainBlurb.textContent = domain.blurb;
          domainCard.appendChild(domainBlurb);

          const buyNowLink = document.createElement("a");
          buyNowLink.classList.add("buy-now-link");
          buyNowLink.href = `https://${domain.name}`;
          buyNowLink.target = "_blank";
          buyNowLink.textContent = "Buy Now";
          domainCard.appendChild(buyNowLink);

          if (domain.minOffer) {
            const makeOfferLink = document.createElement("a");
            makeOfferLink.classList.add("make-offer-link");
            makeOfferLink.href = `https://${domain.name}`;
            makeOfferLink.target = "_blank";
            makeOfferLink.textContent = "Make an Offer";
            domainCard.appendChild(makeOfferLink);
          }

          const shareButton = document.createElement("button");
          shareButton.classList.add("share-button");
          shareButton.textContent = "Share";
          shareButton.addEventListener("click", () => {
            openShareModal(domain.name);
          });
          domainCard.appendChild(shareButton);

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

      renderDomainCards();
    })
    .catch((error) => {
      console.log("Error fetching domain data:", error);
    });
});
