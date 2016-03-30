/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../dist/Toaster.d.ts"/>

describe('Toaster', () => {
    let subject : Toaster;

    beforeEach(function () {
        subject = new Toaster({});
    });

    describe('pub sub', () => {
        it('should return an empty list of subscriptions', () => {
            if(subject.subscribers.length !== 0) {
                throw new Error("Expected an empty array.");
            }
        });
        it('should return a single subscriber', () => {
            subject.subscribe(() => {
                console.log("I am subscribed.")
            });

            if(subject.subscribers.length !== 1) {
                throw new Error("Expected an array length of 1.")
            }
        });
        it('should call a subscriber on a toast', () => {

            subject.subscribe(() => {
                throw new Error("Toast fired.")
            });
            try {
                subject.notify("ERROR", "TEST", "TEST");
            }catch(err){
                if(err.message !== "Toast fired.") {
                    throw new Error("Subscriber did not receive broadcast on toast.")
                }
            }
        });
    });

    describe('notifications', () => {

    });

    describe('notifications dom', () => {

    });

    describe('polyfill load', () => {
        it('should determine if web animations api exists correctly', () => {
            let isFunction = typeof document.createElement('div')["animate"] === "function";
            if(isFunction !== subject.doesNativeWebAnimationsAPIExist()) {
                throw new Error("Web Animations API was not properly detected.")
            }
        });
        it('should load the web animations api if it is not natively supported', () => {
            let nativeExists = subject.doesNativeWebAnimationsAPIExist();
            if(!nativeExists) {
                subject.loadWebAnimationsPolyfill();
            }
        });
    });
});