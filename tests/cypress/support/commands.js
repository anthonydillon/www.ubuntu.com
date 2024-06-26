import "@testing-library/cypress/add-commands";

Cypress.Commands.add("acceptCookiePolicy", () => {
  cy.findByRole("button", { name: "Accept all and visit site" }).click();
});

Cypress.Commands.add("login", ({ username, password }) => {
  cy.task("login", { username, password }, { timeout: 20000 }).then(
    async (user) => {
      user.cookies.forEach(({ name, value }) => {
        cy.setCookie(name, value);
      });
    }
  );
});

Cypress.Commands.add("iframeLoaded", { prevSubject: "element" }, ($iframe) => {
  const contentWindow = $iframe.prop("contentWindow");
  return new Promise((resolve) => {
    if (contentWindow && contentWindow.document.readyState === "complete") {
      resolve(contentWindow);
    } else {
      $iframe.on("load", () => {
        resolve(contentWindow);
      });
    }
  });
});

Cypress.Commands.add(
  "getInDocument",
  { prevSubject: "document" },
  (document, selector) => Cypress.$(selector, document)
);

Cypress.Commands.add("getWithinIframe", (targetElement) =>
  cy.get("iframe").iframeLoaded().its("document").getInDocument(targetElement)
);
