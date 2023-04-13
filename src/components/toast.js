import { getMaxZIndex, getTextClass, triggerEvent } from "../utils";
import { Toast as bs5Toast } from "bootstrap";
import { makeIcon } from "../resource/icons";

/**
 * Displays a toast message with customizable options.
 * @param {string} message - The message to display in the toast.
 * @param {Object} options - An object containing customizable options for the toast.
 * @param {string} options.title - The title of the toast.
 * @param {string} options.subtitle - The subtitle of the toast.
 * @param {string} options.position - The position of the toast on the screen.
 * @param {string} options.type - The type of toast (success, warning, error, etc.).
 * @param {boolean} options.closeBtn - Whether or not to display a close button on the toast.
 * @param {string} options.textColor - The text color of the toast.
 * @param {string} options.icon - The icon to display on the toast.
 * @param {string} options.iconClass - The class to apply to the icon on the toast.
 * @param {string} options.iconStyle - The style to apply to the icon on the toast.
 * @param {number} options.timeout - The amount of time (in milliseconds) to display the toast.
 * @param {function} options.onShow - A function to call when the toast is shown.
 * @param {function} options.onShown - A function to call after the toast is shown.
 * @param {function} options.onHide - A function to call when the toast is hidden.
 * @param {function} options.onHidden - A function to call after the toast is hidden.
 */

export function toast(message, options) {
  // Set default options
  const defaultOptions = {
    title: "",
    subtitle: "",
    position: "bottom-right",
    type: "success",
    closeBtn: false,
    icon: "bs5-point",
    iconClass: "",
    iconStyle: "",
    timeout: 3000,
    onShow: function () {},
    onShown: function () {},
    onHide: function () {},
    onHidden: function () {}
  };

  options = { ...defaultOptions, ...options };



  const toastElement = document.createElement("div");
  toastElement.classList.add("toast", "bs5-dialog-msg", "bs5-dialog-msg-" + options.position);
  toastElement.setAttribute("role", "alert");
  toastElement.style.zIndex = getMaxZIndex() + 1;
  // Create toast body element
  const toastBodyElement = document.createElement("div");
  toastBodyElement.classList.add("toast-body", "bg-white");
  toastBodyElement.innerHTML = message;

  // Add header and body to toast element
  // Create toast header element
  if (options.title) {
    const toastHeaderElement = document.createElement("div");
    let textColor = getTextClass("bg-" + options.type);
    toastHeaderElement.classList.add("toast-header", `bg-${options.type}`, textColor);
    toastHeaderElement.innerHTML = `<strong class="me-auto">${
      options.title || ""
    }</strong> <small class="text-truncate" style="max-width: 50%;">${options.subtitle}</small><button type="button" class="btn-close ${
      textColor === "text-white" ? "btn-close-white" : ""
    }" data-bs-dismiss="toast" aria-label="Close"></button>`;
    toastElement.appendChild(toastHeaderElement);

    if (options.icon) {
      const iconElement = makeIcon(options.icon, options.iconClass, options.iconStyle);
      iconElement.classList.add(textColor);
      toastHeaderElement.prepend(iconElement);
      toastHeaderElement.classList.add("ps-1");
    }
  }

  toastElement.appendChild(toastBodyElement);
  document.body.appendChild(toastElement);

  triggerEvent("bs5:dialog:show", { options: options });
  if (typeof options.onShow === "function") {
    options.onShow();
  }


  const toastInstance = new bs5Toast(toastElement, { delay: options.timeout, autohide: options.timeout ? true : false });
  toastInstance.show();
  toastElement.addEventListener("hide.bs.toast", event => {
    console.log('hide.bs.toast')
    triggerEvent( "bs5:dialog:hide", { options: options });
    toastElement.classList.add("bs5-dialog-msg-hide");
    if (typeof options.onHide === "function") {
      options.onHide(event);
    }
  });
  toastElement.addEventListener("hidden.bs.toast", event => {
    console.log('hidden.bs.toast')
    triggerEvent( "bs5:dialog:hidden", { options: options });
    if (typeof options.onHidden === "function") {
      options.onHidden(event);
    }
  });




  toastElement.addEventListener("shown.bs.toast", event => {
    console.log('shown.bs.toast')
    triggerEvent("bs5:dialog:shown", { options: options });
    if (typeof options.onShown === "function") {
      options.onShown(event);
    }
  });

  return {
    el:toastElement,
    message,
    options
  }
}
