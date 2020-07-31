module.exports = function (
  /** @type {import('plop').NodePlopAPI} */
  plop
) {
  const destinationPath =
    process.cwd() + "/src/modules/{{ lowerCase moduleId }}";
  // const templatePath =
  //   process.cwd() + "../template";
  const templatePath = "../template";

  plop.setGenerator("FA Module generator", {
    description: "Plop generator for a React webpack UI",
    prompts: [
      {
        type: "input",
        name: "moduleId",
        message: "Module Id (all lowercase, no space or special characters)?",
        validate: function (value) {
          if (/.+/.test(value)) {
            return true;
          }
          return "Module Id is required";
        },
      },
    ],
    actions: function () {
      var actions = [];
      const folders = [
        "",
        "components",
        "helpers",
        "locale",
        "pages",
        "services",
        "state",
        "tests",
      ];

      folders.map((folder) =>
        actions.push({
          type: "addMany",
          destination: `${destinationPath}/${folder}`,
          base: `${templatePath}/${folder}`,
          templateFiles: `${templatePath}/${
            folder === "" ? "" : folder + "/"
            }*`,
          skipIfExists: true,
          verbose: false,
        })
      );

      return actions;
    },
  });
};
