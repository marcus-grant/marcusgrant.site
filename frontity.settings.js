const settings = {
  "name": "marcusgrant.site",
  "state": {
    "frontity": {
      "url": "https://test.frontity.org",
      "title": "Test Frontity Blog",
      "description": "WordPress installation for Frontity development"
    }
  },
  "packages": [
    // {
    //   "name": "@frontity/mars-theme",
    //   "state": {
    //     "theme": {
    //       "menu": [
    //         ["Home","/"],
    //         ["Block", "/category/block/"],
    //         ["Classic", "/category/classic/"],
    //         ["Alignments", "/tag/alignment-2/"],
    //         ["About", "/about/"]
    //       ],
    //       "featured": {
    //         "showOnList": false,
    //         "showOnPost": false
    //       }
    //     }
    //   }
    // },
    {
      "name": "retrobox-theme"
    },
    {
      "name": "@frontity/wp-source",
      "state": {
        // Modify this URL to match the base domain of the WORDPRESS server
        // NOT the frontity server
        "source": {
          // "api": "http://marcusgrantsite.local/wp-json"
          // "api": "http://127.0.0.1:8088/wp-json"
          "api": "https://marcusgrant.site/wp-json"
        }
      }
    },
    "@frontity/tiny-router",
    "@frontity/html2react"
  ]
};

export default settings;
