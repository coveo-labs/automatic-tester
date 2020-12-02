describe("WIMS", function () {
  //Keep browser open when fails
  this.endSessionOnFail = false;
  this.abortOnElementLocateError = false;
  this.abortOnAssertionFailure = false;
  this.waitForConditionTimeout = 5000;

  xtest("Workplace2", async function (browser) {
    const coveo = browser.page.Coveo();
    browser.url(
      "https://search.cloud.coveo.com/pages/workplacedemoqjjnc2v7/full2"
    );
    let result = await coveo.c_loginOffice(
      "adelev@M365x988456.onmicrosoft.com",
      "&Qwerty 123"
    );
    console.log("Logged in: " + result);
    browser.pause(5000);
  });

  xtest("Philips", function (browser) {
    const coveo = browser.page.Coveo();
    browser.url(
      "https://search-eu.cloud.coveo.com/pages/philips5pi3khvx/Demo#q=one%20blade&first=10&t=All&sort=relevancy"
    );
    browser.pause(5000);
  });

  xtest("subzero", async function (browser) {
    const coveo = browser.page.Coveo();
    browser.url("https://www.subzero-wolf.com/");
    let res = true;
    if (res) res = await coveo.c_click("#js-allow-cookies");
    if (res) res = await coveo.c_click("#search-trigger");
    if (res)
      res = await coveo.search(
        "grill",
        "",
        "#spotlightSearch .CoveoQuerybox .magic-box-input > input"
      );
    /*coveo
      .c_click("#js-allow-cookies")
      .c_click("#search-trigger")
      .c_search(
        "grill",
        "",
        "#spotlightSearch .CoveoQuerybox .magic-box-input > input"
      );*/
    if (res) {
      browser.keys(browser.Keys.ENTER);
      res = await coveo.c_waitForElement(
        ".search-result__section .search-result"
      );
      if (res)
        res = await coveo.c_waitForElement(
          `//*[contains(@class,'CoveoResultLink') and contains(text(), 'Outdoor Gas')]`,
          "xpath"
        );
    }

    if (res)
      res = await coveo.search(
        "cooler",
        "",
        "#spotlightSearch .CoveoQuerybox .magic-box-input > input"
      );
    /*browser
      .waitForElementNotPresent(
        "xpath",
        `//*[contains(@class,'CoveoResultLink') and contains(text(), 'Wine Storage')]`
      )
      .keys(browser.Keys.ENTER)
      .waitForElementVisible(
        "xpath",
        `//*[contains(@class,'CoveoResultLink') and contains(text(), 'Wine Storage')]`
      );*/

    browser.end();
  });

  xtest("enbridge", async function (browser) {
    const coveo = browser.page.Coveo();
    //Set pause between events to 1 second

    coveo.setPause(1000);
    browser.url("https://www.enbridge.com/about-us");

    let res = await coveo.search("gas", "", "#mainSearch");
    if (res) {
      browser.keys(browser.Keys.ENTER);
      browser.pause(1000);

      res = await coveo.c_moveToElement(
        "#search > div:nth-child(3) > div > div > div.coveo-results-column.search-results > div.CoveoResultList > div.results-container.coveo-result-list-container > div:nth-child(1) > div.small-22.small-centered.medium-uncentered.medium-24.large-8.xlarge-12.medium-wide-only.xlarge-wide-up.columns > article",
        20,
        20
      );
    }
    if (res) browser.pause(1000);
    res = await coveo.c_click(
      "#search > div:nth-child(3) > div > div > div.coveo-results-column.search-results > div.CoveoResultList > div.results-container.coveo-result-list-container > div:nth-child(1) > div.small-22.small-centered.medium-uncentered.medium-24.large-8.medium-wide-only.xlarge-wide-up.xlarge-12.columns > article > div.tile__cta > a"
    );
    //************************************************************
    //Could be that current window is switched
    //************************************************************
    let closeCurrentWindow = false;
    browser.windowHandles(function (result) {
      if (result.value.length == 2) {
        handle = result.value[1];
        browser.switchWindow(handle);
        closeCurrentWindow = true;
      }
    });
    //right column
    browser.pause(2000);
    //We first need to move to the element, then the result link will appear
    res = await coveo.c_moveToElement("article:nth-child(2)", 10, 10);
    browser.pause(2000);
    res = await coveo.c_click("article:nth-child(2) > div.tile__cta > a");

    browser.pause(2000);
    //Close the new window
    if (closeCurrentWindow) {
      browser.closeWindow();
      browser.windowHandles(function (result) {
        handle = result.value[0];
        browser.switchWindow(handle);
      });
    }

    browser.url(
      "https://www.enbridge.com/about-us/natural-gas-transmission-and-midstream"
    );
    browser.pause(2000);
    res = await coveo.c_moveToElement("article:nth-child(2)", 10, 10);
    browser.pause(2000);
    res = await coveo.c_moveToElement("article:nth-child(3)", 10, 10);
    browser.pause(2000);
    res = await coveo.c_moveToElement("article:nth-child(4)", 10, 10);
    browser.pause(5000);

    browser.end();
  });

  xtest("step b: the gym search", async function (browser) {
    const coveo = browser.page.Coveo();
    //Set pause between events to 1 second
    coveo.setPause(1000);
    browser.url("https://thegym.coveodemo.com/");

    let res = await coveo.searchAndClickSuggestion(
      "pan",
      "",
      2,
      "#search-input",
      "#form-search > div.search-field-wrap > div > div:nth-child(2)"
    );
    console.log(" Here now: " + res);
    if (res) res = await coveo.selectFacetValue("M");
    if (res)
      res = await coveo.clickResult(
        "2",
        "",
        5,
        "#coveo-result-list4 > div > div:nth-child(2) .card__item-price"
      );
    browser.pause(1000);
    //Add to cart
    if (res) res = await coveo.c_click("form > div > button");
    browser.pause(2000);
    //Click on recommendation
    if (res)
      res = await coveo.clickRecommendation(
        "",
        "",
        3,
        "#homeProductsPopular > div.CoveoResultList > div > div > div > div:nth-child(3) > div > div > div > a > div.card__item-price"
      );
    //New search
    if (res) res = await coveo.search("gloves", "", "#search-input");
    //Hit enter
    browser.keys(browser.Keys.ENTER);
    browser.pause(3000);

    browser.end();
  });

  xtest("Workplace", async function (browser) {
    const coveo = browser.page.Coveo();
    browser.url(
      "https://search.cloud.coveo.com/pages/workplacedemoqjjnc2v7/full2"
    );
    let res = true;
    if (res)
      res = await coveo.loginOffice(
        "adelev@M365x988456.onmicrosoft.com",
        "&Qwerty 123"
      );
    browser.pause(2000);
    if (res) res = await coveo.c_setValue("#ProfilesDropdown", "Mark 8");
    browser.pause(2000);
    await coveo.makeVisible(".CoveoQuickview");
    await coveo.makeVisible(".CoveoEditWidget");
    //click on quickview widgets
    if (res) res = await coveo.clickQuickview("1", "#Rec2");
    if (res) res = await coveo.clickQuickview("2", "#Rec1");
    if (res)
      res = await coveo.c_click(
        "#teamwidget > div > div.coveo-facet-settings-more"
      );
    if (res) res = await coveo.c_click("body");
    if (res)
      res = await coveo.c_click(
        "#selectedwidget > div > div.coveo-facet-settings-more"
      );
    if (res) res = await coveo.c_click("body");
    if (res) res = await coveo.c_click("#mySidePeople");
    if (res) res = await coveo.c_click("#myDashboard");
    if (res) res = await coveo.searchAndSubmit("mark 8");
    browser.pause(5000);
    //coveo.waitForElementVisible("@searchbox");
    //coveo.search("exchange");
    browser.end();
  });

  xtest("step b: salesforce search", async function (browser) {
    const coveo = browser.page.Coveo();
    //Set pause between events to 1 second
    coveo.setPause(1000);
    browser.url("https://help.salesforce.com/home");
    //Get rid of pop up consent
    browser.pause(1000);
    let res = true;
    if (res) res = await coveo.c_click("#onetrust-accept-btn-handler");
    browser.pause(1000);

    if (res)
      res = await coveo.searchAndClickSuggestion(
        "exch",
        "#tds-header-search",
        2
      );
    if (res) res = await coveo.search("exchange", "#tds-header-search");
    if (res) res = await coveo.c_click("#tds-header-search > div > span");
    res = true;
    //Random facets
    if (res) res = await coveo.selectFacet("@objecttype");
    if (res) res = await coveo.deselectFacet();
    if (res) res = await coveo.selectTab("Answers");
    if (res) res = await coveo.selectTab("Articles");
    if (res)
      res = await coveo.c_click(
        "#TopicFacet > ul > li:nth-child(1) > div.coveo-has-childs-toggle > span.coveo-hierarchical-facet-expand"
      );
    if (res)
      res = await coveo.selectFacetValue(
        "All|General Salesforce Functionality|Desktop Add-Ons"
      );
    if (res)
      res = await coveo.deSelectFacetValue(
        "All|General Salesforce Functionality|Desktop Add-Ons"
      );

    if (res) res = await coveo.clickResult("1");
    if (res)
      res = await coveo.clickRecommendation(
        "2",
        "#recommendedtraining_articleview_docs"
      );
    browser.end();
  });

  xtest("step b: bmc search", async function (browser) {
    const coveo = browser.page.Coveo();
    //Set pause between events to 1 second
    coveo.setPause(1000);
    browser.url("https://www.bmc.com/support/resources/support-search.html");
    //Get rid of pop up consent
    browser.pause(1000);
    browser.getAttribute(".truste_box_overlay iframe", "id", (result) => {
      browser.pause(1000);
      let frame = browser.frame(result.value, (result) => {
        browser.click(".pdynamicbutton > a");
        browser.click("#gwt-debug-close_id");
      });
    });

    browser.click("body");
    browser.pause(1000);
    let res = true;
    if (res)
      res = await coveo.searchAndClickSuggestion(
        "exch",
        "#supprt-search-input",
        2
      );
    if (res)
      res = await coveo.searchAndSubmit("exchange", "#supprt-search-input");
    //Random facets
    if (res) res = await coveo.selectFacet("@bmcproductname");
    if (res) res = await coveo.deselectFacet();
    if (res) res = await coveo.selectFacet("@bmcproductname");
    if (res) res = await coveo.deselectFacet();
    if (res) res = await coveo.clickQuickview("RND");
    if (res) res = await coveo.clickQuickview("2");
    if (res) res = await coveo.clickResult("1");
    if (res) res = await coveo.clickRecommendation("RND");
    browser.end();
  });

  test("step b: coveo search", async function (browser) {
    const coveo = browser.page.Coveo();
    //Set pause between events to 1 second
    coveo.setPause(1000);
    browser.url(
      "https://connect.coveo.com/s/global-search/%40uri#t=All&sort=relevancy"
    );
    let res = true;
    if (res)
      res = await coveo.searchAndClickSuggestion(
        "exch",
        "#unifiedSearchPage",
        2
      );
    if (res)
      res = await coveo.searchAndSubmit("exchange", "#unifiedSearchPage");
    if (res) res = await coveo.makeVisible(".CoveoQuickview");
    browser.elements("css selector", ".CoveoResult", (labels) => {
      console.log(labels.value.length);
    });

    if (res) res = await coveo.clickQuickview("RND");
    if (res) res = await coveo.selectFacetValue("Newsroom");
    browser.pause(1000);
    if (res) res = await coveo.deSelectFacetValue("Newsroom");
    browser.pause(5000);
    //Random facets
    if (res) res = await coveo.selectFacet("@commonresourcetype");
    if (res) res = await coveo.deselectFacet();
    if (res) res = await coveo.selectFacet("@commonplatformcomponent");
    if (res) res = await coveo.deselectFacet();
    if (res) res = await coveo.clickQuickview("2");
    if (res) res = await coveo.clickResult("1");
    if (res) res = await coveo.clickRecommendation("RND");
    browser.end();
  });
  test("step b: motorola search", async function (browser) {
    const coveo = browser.page.Coveo();
    //Set pause between events to 1 second
    coveo.setPause(1000);
    browser.url(
      "https://www.motorolasolutions.com/en_us/search.html#t=Tab_All"
    );
    browser.pause(1000);
    //Get rid of pop up consent
    browser.getAttribute(".truste_box_overlay iframe", "id", (result) => {
      browser.pause(1000);
      let frame = browser.frame(result.value, (result) => {
        browser.click(".pdynamicbutton > a");
      });
    });
    browser.pause(1000);
    //Continue with search
    let res = true;
    if (res)
      res = await coveo.searchAndClickSuggestion(
        "ret",
        "#coveoSearchInterface_main",
        2
      );
    browser.pause(5000);
    if (res)
      res = await coveo.searchAndSubmit("retail", "#coveoSearchInterface_main");
    browser.pause(5000);
    if (res) res = await coveo.selectFacetValue("MSI.com DAM");
    browser.pause(1000);
    if (res) res = await coveo.deSelectFacetValue("MSI.com DAM");
    browser.pause(5000);
    //Random facets
    if (res) res = await coveo.selectFacet("@source");
    if (res) res = await coveo.deselectFacet();
    if (res) res = await coveo.selectTab("Tab_PagesDocs__caption");
    if (res) res = await coveo.clickResult("1");
    browser.end();
  });
});
