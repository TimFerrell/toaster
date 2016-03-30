/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../dist/Toaster.d.ts"/>
describe('Toaster', function () {
    var subject;
    beforeEach(function () {
        subject = new Toaster({});
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
                subject.notify("ERROR", "TEST", "TEST");
            }
            catch (err) {
                if (err.message !== "Toast fired.") {
                    throw new Error("Subscriber did not receive broadcast on toast.");
                }
            }
        });
    });
    describe('notifications', function () {
    });
    describe('notifications dom', function () {
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
