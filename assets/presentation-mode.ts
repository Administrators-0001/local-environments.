import { learning_paths as paths } from "./json-collector";

const params = new URLSearchParams(document.location.search);
const presentationMode = params.get("presentation_mode");

const currentLearningPath = params.get("learning_path");
let currentPathData;

if (currentLearningPath !== null) {
  for (const path in paths) {
    if (paths[path]["uid"] === currentLearningPath) {
      currentPathData = paths[path];
    }
  }
}

function hasChildInArray(element, array) {
  return Array.from(element.querySelectorAll("*")).some((child) =>
    array.includes(child)
  );
}

function cuePresentationMode() {
  if (presentationMode) {
    const navigationButtons = document.getElementsByClassName(
      "learningNavigation Button"
    );
    
    if (navigationButtons) {
      for (const item of navigationButtons) {
        const currentHref = item.getAttribute("href").split("?").shift();
        item.setAttribute(
          "href",
          currentHref +
            "?learning_path=" +
            currentLearningPath +
            "&presentation_mode=true"
        );
      }
    }

    // Get the elements to keep
    const elementsToKeep = Array.from(
      document.querySelectorAll("h1, .progressIndicator *, #presentationMode *")
    );

    // Loop through all elements in the body and remove those that are not in the 'elementsToKeep' list
    document.querySelectorAll("body *").forEach((element) => {
      if (
        !elementsToKeep.includes(element) &&
        !hasChildInArray(element, elementsToKeep)
      ) {
        element.remove();
      }
    });

    // Apply presentation-specific styles
    const docBody = document.getElementById("DocsBody")
    docBody.classList.add("PresentationMode")

    //If hidden, unhide the presentation content
    const presentationModeContent = document.getElementById("presentationMode")
    presentationModeContent.style.setProperty("display", "block", "important");

    // Unhide the page now that transitions are done
    const page = document.getElementById("DocsPage");
    page.style.visibility = "visible";
  }
}

setTimeout(cuePresentationMode, 500);
