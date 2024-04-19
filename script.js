// script.js
document.addEventListener("DOMContentLoaded", () => {
  const domainList = document.querySelector(".domain-list");
  const searchInput = document.querySelector(".search-input");

  fetch("domains.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error fetching domains.json");
      }
      return response.json();
    })
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
          const originalPrice = parseFloat(domain.price) * 2.07;
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

        updateDomainCount();
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

      function filterDomains() {
        const searchTerm = searchInput.value.toLowerCase();
        const allTags = Array.from(
          document.querySelectorAll(".search-tag:not(.all):not(.other)")
        ).map((tag) => tag.textContent.toLowerCase());

        const isOtherSelected = document
          .querySelector(".search-tag.other")
          .classList.contains("selected");
        let filteredDomains;

        if (isOtherSelected) {
          // If "Other" is selected, filter out domains that match any of the tags
          filteredDomains = data.filter((domain) => {
            const domainNameLower = domain.name.toLowerCase();
            return allTags.every((tag) => !domainNameLower.includes(tag));
          });
        } else {
          // If "Other" is not selected, filter based on selected tags (OR condition)
          const selectedTags = Array.from(
            document.querySelectorAll(
              ".search-tag.selected:not(.all):not(.other)"
            )
          ).map((tag) => tag.textContent.toLowerCase());

          if (selectedTags.length > 0) {
            // Include domains that match any of the selected tags
            filteredDomains = data.filter((domain) => {
              const domainNameLower = domain.name.toLowerCase();
              return selectedTags.some((tag) => domainNameLower.includes(tag));
            });
          } else {
            // If no tags are selected, include all domains before the search term filter
            filteredDomains = data.slice();
          }
        }

        // Apply the search term to the filtered domains list
        domains = filteredDomains.filter((domain) =>
          domain.name.toLowerCase().includes(searchTerm)
        );

        renderDomainCards();
        updateMoreResultsPrompt();
        updateDomainCount();
      }

      function handleSearchInput() {
        filterDomains();
        if (searchInput.value.trim() !== "") {
          clearSearch.style.display = "block";
        } else {
          clearSearch.style.display = "none";
        }
      }

      searchInput.addEventListener("input", handleSearchInput);

      const clearSearch = document.querySelector(".clear-search");
      clearSearch.addEventListener("click", () => {
        searchInput.value = "";
        filterDomains();
        clearSearch.style.display = "none";
      });

      const clearSearchTagsLink = document.getElementById("clear-search-tags");
      clearSearchTagsLink.addEventListener("click", () => {
        searchInput.value = "";
        const selectedTags = document.querySelectorAll(".search-tag.selected");
        selectedTags.forEach((tag) => tag.classList.remove("selected"));
        const allTag = document.querySelector(".search-tag.all");
        allTag.classList.add("selected");
        filterDomains();
      });

      function updateMoreResultsPrompt() {
        const moreResultsPrompt = document.getElementById(
          "more-results-prompt"
        );
        const searchTerm = searchInput.value.toLowerCase();
        const selectedTags = Array.from(
          document.querySelectorAll(".search-tag.selected:not(.all)")
        );

        if ((searchTerm || selectedTags.length > 0) && domains.length === 0) {
          moreResultsPrompt.style.display = "block";
        } else {
          moreResultsPrompt.style.display = "none";
        }
      }

      function updateDomainCount() {
        const domainCount = document.getElementById("domain-count");
        domainCount.textContent = `${domains.length} domains found`;
      }

      function handleTagClick(event) {
        const clickedTag = event.target;
        const isAllTag = clickedTag.classList.contains("all");
        const isOtherTag = clickedTag.classList.contains("other");

        if (isAllTag) {
          const selectedTags = document.querySelectorAll(
            ".search-tag.selected"
          );
          selectedTags.forEach((tag) => tag.classList.remove("selected"));
          clickedTag.classList.add("selected");
        } else if (isOtherTag) {
          const allTag = document.querySelector(".search-tag.all");
          const selectedTags = document.querySelectorAll(
            ".search-tag.selected:not(.other)"
          );
          selectedTags.forEach((tag) => tag.classList.remove("selected"));
          clickedTag.classList.toggle("selected");
          if (!clickedTag.classList.contains("selected")) {
            allTag.classList.add("selected");
          }
        } else {
          const allTag = document.querySelector(".search-tag.all");
          const otherTag = document.querySelector(".search-tag.other");
          allTag.classList.remove("selected");
          otherTag.classList.remove("selected");
          clickedTag.classList.toggle("selected");
          if (
            !document.querySelectorAll(
              ".search-tag.selected:not(.all):not(.other)"
            ).length
          ) {
            allTag.classList.add("selected");
          }
        }

        filterDomains();
      }

      const tagTerms = document.querySelectorAll(".tip-text dt");
      tagTerms.forEach((term) => {
        term.addEventListener("click", () => {
          const tagName = term.textContent.trim().toLowerCase();
          const correspondingTag = document.querySelector(
            `.search-tag[data-tag="${tagName}"]`
          );
          if (correspondingTag) {
            searchInput.value = "";
            const selectedTags = document.querySelectorAll(
              ".search-tag.selected"
            );
            selectedTags.forEach((tag) => tag.classList.remove("selected"));
            correspondingTag.classList.add("selected");
            filterDomains();
            const domainCountContainer = document.querySelector(
              ".domain-count-container"
            );
            domainCountContainer.scrollIntoView({ behavior: "smooth" });
          }
        });
      });

      function renderSearchTags() {
        const searchTags = document.getElementById("search-tags");
        searchTags.innerHTML = "";

        const allTag = document.createElement("span");
        allTag.classList.add("search-tag", "all", "selected");
        allTag.textContent = "All";
        allTag.addEventListener("click", handleTagClick);
        searchTags.appendChild(allTag);

        const tags = [
          { name: "ai" },
          { name: "asi" },
          { name: "chat" },
          { name: "agi" },
          { name: "gpt" },
          { name: "agent" },
          { name: "model" },
          { name: "voice" },
          { name: "robot" },
          { name: "afm" },
          { name: "fwm" },
          { name: "lm" },
          { name: "gen" },
          { name: "deepfake" },
          { name: "devin" },
          { name: "sora" },
          { name: "suno" },
          { name: "isaacgym" },
          { name: "perplexity" },
          { name: "com" },
          { name: "app" },
          { name: "io" },
          { name: "news" },
          { name: "codes" },
          { name: "dev" },
          { name: "consulting" },
          { name: "expert" },
          { name: "pro" },
          { name: "guru" },
          { name: "ninja" },
          { name: "tips" },
          { name: "guide" },
          { name: "blog" },
          { name: "software" },
          { name: "engineer" },
          { name: "surgery" },
          { name: "health" },
        ];

        tags.forEach((tag) => {
          const tagElement = document.createElement("span");
          tagElement.classList.add("search-tag");
          tagElement.setAttribute("data-tag", tag.name);
          tagElement.textContent = tag.name;
          tagElement.addEventListener("click", handleTagClick);
          searchTags.appendChild(tagElement);
        });

        const otherTag = document.createElement("span");
        otherTag.classList.add("search-tag", "other");
        otherTag.setAttribute("data-tag", "other");
        otherTag.textContent = "Other";
        otherTag.addEventListener("click", handleTagClick);
        searchTags.appendChild(otherTag);
      }

      function scrollToTop() {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }

      const scrollToTopButton = document.getElementById("scroll-to-top");
      window.addEventListener("scroll", () => {
        if (window.pageYOffset > 100) {
          scrollToTopButton.style.display = "block";
        } else {
          scrollToTopButton.style.display = "none";
        }
      });
      scrollToTopButton.addEventListener("click", scrollToTop);
      searchInput.addEventListener("input", filterDomains);

      renderSearchTags();
      renderDomainCards();
    })
    .catch((error) => {
      console.error("Error fetching domain data:", error);
      // Handle the error, display a message to the user, etc.
    });
});
