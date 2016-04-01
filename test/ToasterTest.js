/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../dist/Toaster.d.ts"/>
describe('Toaster', function () {
    var subject;
    beforeEach(function () {
        subject = new Toaster();
    });
    describe('pub sub', function () {
        it('should return an empty list of subscriptions', function () {
            if (subject.subscribers.length !== 0) {
                throw new Error("Expected an empty array.");
            }
        });
        it('should return a single subscriber', function () {
            subject.subscribe(function () {
                console.log("I am subscribed.");
            });
            if (subject.subscribers.length !== 1) {
                throw new Error("Expected an array length of 1.");
            }
        });
        it('should call a subscriber on a toast', function () {
            subject.subscribe(function () {
                throw new Error("Toast fired.");
            });
            try {
                subject.notify(ToasterNotificationType.INFO, "TEST", "TEST");
            }
            catch (err) {
                if (err.message !== "Toast fired.") {
                    throw new Error("Subscriber did not receive broadcast on toast.");
                }
            }
        });
    });
    describe('notifications', function () {
        it('should create a notification', function () {
            var container = subject.getContainer();
            var numberOfStartingNotifications = container.querySelectorAll(".toast").length;
            subject.notify(ToasterNotificationType.INFO, "Generic notification", "Woh zo.");
            var numberOfEndingNotifications = container.querySelectorAll(".toast").length;
            if ((numberOfStartingNotifications + 1) != numberOfEndingNotifications) {
                throw new Error("Container child count did not change when notification added.");
            }
        });
        it('should create an info notification', function () {
            var container = subject.getContainer();
            var numberOfStartingInfoNotifications = container.querySelectorAll(".toaster-info").length;
            subject.notify(ToasterNotificationType.INFO, "Lumpo Bumpo", "Pick up my whoopsie.");
            var numberOfEndingInfoNotifications = container.querySelectorAll(".toaster-info").length;
            if ((numberOfStartingInfoNotifications + 1) != numberOfEndingInfoNotifications) {
                throw new Error("Info notification not added.");
            }
        });
        it('should create an error notification', function () {
            var container = subject.getContainer();
            var numberOfStartingInfoNotifications = container.querySelectorAll(".toaster-error").length;
            subject.notify(ToasterNotificationType.ERROR, "Oopsies", "Live your dreams.");
            var numberOfEndingInfoNotifications = container.querySelectorAll(".toaster-error").length;
            if ((numberOfStartingInfoNotifications + 1) != numberOfEndingInfoNotifications) {
                throw new Error("Error notification not added.");
            }
        });
        it('should create an success notification', function () {
            var container = subject.getContainer();
            var numberOfStartingInfoNotifications = container.querySelectorAll(".toaster-success").length;
            subject.notify(ToasterNotificationType.SUCCESS, "Yes", "Live your dreams.");
            var numberOfEndingInfoNotifications = container.querySelectorAll(".toaster-success").length;
            if ((numberOfStartingInfoNotifications + 1) != numberOfEndingInfoNotifications) {
                throw new Error("Success notification not added.");
            }
        });
        it('should create a warning notification', function () {
            var container = subject.getContainer();
            var numberOfStartingInfoNotifications = container.querySelectorAll(".toaster-warning").length;
            subject.notify(ToasterNotificationType.WARNING, "Princess Bride", "Most overrated movie of all time?");
            var numberOfEndingInfoNotifications = container.querySelectorAll(".toaster-warning").length;
            if ((numberOfStartingInfoNotifications + 1) != numberOfEndingInfoNotifications) {
                throw new Error("Warning notification not added.");
            }
        });
        it('should create a snackbar', function () {
            subject.notify(ToasterNotificationType.SNACKBAR, "Om nom.", "I love to eat snackz!");
        });
    });
    describe('container', function () {
        it('should create a container', function () {
            var container = subject.getContainer();
            if (container === null) {
                throw new Error("Get container did not return container.");
            }
        });
        it('should not re-create a container that already exists', function () {
            var container1 = subject.getContainer();
            container1.setAttribute("test", "test");
            var container2 = subject.getContainer();
            if (container2.getAttribute("test") !== "test") {
                throw new Error("Container was mutated after creation.");
            }
        });
        it('should attach to the body if no target is provided.', function () {
            var container = subject.getContainer();
            if (container.parentNode.nodeName !== "BODY") {
                throw new Error("Container did not attach to body.");
            }
        });
        it('should attach to an overriden target', function () {
            // Remove the container if it already exists.
            var existingContainer = document.getElementById(new ToasterOptions().containerId);
            if (existingContainer !== null) {
                existingContainer.parentNode.removeChild(existingContainer);
            }
            var options = new ToasterOptions();
            options.containerTarget = "head";
            var container = subject.getContainer(options);
            if (container.parentNode.nodeName !== "HEAD") {
                throw new Error("Container did not attach to the head.");
            }
        });
        it('should have aria-live polite', function () {
            var container = subject.getContainer();
            var ariaAttribute = container.getAttribute("aria-live");
            if (ariaAttribute !== "polite") {
                throw new Error("Aria-live not set to polite.");
            }
        });
        it('should have role of alert', function () {
            var container = subject.getContainer();
            var roleAttribute = container.getAttribute("role");
            if (roleAttribute !== "alert") {
                throw new Error("Role not set to alert.");
            }
        });
    });
    describe('polyfill load', function () {
        it('should determine if web animations api exists correctly', function () {
            var isFunction = typeof document.createElement('div')["animate"] === "function";
            if (isFunction !== subject.doesNativeWebAnimationsAPIExist()) {
                throw new Error("Web Animations API was not properly detected.");
            }
        });
        it('should load the web animations api if it is not natively supported', function () {
            var nativeExists = subject.doesNativeWebAnimationsAPIExist();
            if (!nativeExists) {
                subject.loadWebAnimationsPolyfill();
            }
        });
    });
});
