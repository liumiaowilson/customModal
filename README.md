# Custom Modal
Custom Modal is a clean and straight-forward way to create lightning modals.

## Prerequisites
This component has dependency on **lightning/alert** from summer 22 release. So api version for these lwc components are version 55.

## Get Started
It's simple to create a custom modal with messages only.

Here is the code:
```javascript
CustomModal.open({
    label: 'Custom',
    message: 'Are you sure you want to continue?',
    btnSaveText: 'Yes',
    btnCancelText: 'No',
}).then(data => {
    if(data.button === 'save') {
        console.log('Continue');
    }
    else {
        console.log('Cancel');
    }
});
```

Here is the screen snapshot:
![CustomModalSimpleTest](/docs/customModalSimpleTest.png "CustomModalSimpleTest")

To build a custom modal with your own component, you can either extend from **CustomModal**
```javascript
export default class MyCustomModal extends CustomModal {
    // ...
}

CustomModal.define(MyCustomModal, 'c-my-custom-modal');
```

It's essential that we need to define our custom modal with the tag name so that our custom modal can be created successfully.

Or we can use a template fragment, like this:
```javascript
CustomModal.open({
    label: 'Custom',
    fragment: CustomModal.buildFragment({
        state: {
            count: 1,
        },
        view: custom,
        actions: fragment => ({
            onClick: e => {
                fragment.setState({
                    count: fragment.state.count + 1,
                });
            },
        }),
        style: `
        .countBox {
            color: green;
        }
        `,
        callbacks: fragment => ({
            connectedCallback: () => {
                fragment.setState({
                    count: 2,
                });
            },
            renderedCallback: () => {
                const btn = fragment.template.querySelector('lightning-button');
                btn.label = 'Increment';
            },
        }),
    }),
    buttons: [
        {
            name: 'save',
            label: 'Save',
            variant: 'brand',
            execute: state => state, // optional
            disabled: state => state.count > 3,
        },
    ],
}).then(data => {
    console.log(data);
});
```

Here is the screen snapshot:
![CustomModalComplexTest](/docs/customModalComplexTest.png "CustomModalComplexTest")

We create a custom html template as the **view**, and define our own style, state, actions and callbacks. In this way, we can create some light-weight custom modals without having to build an independent component just to be used once.

## Pros and Cons

### Pros
This implementation uses salesforce standard modal behavior and shows at least below advantages:

1. The modal is not inserted into our custom dom structure. Instead, it's directly appended to **lightning-overlay-container** under document body. So this custom modal is not part of our custom component, and is not affected by our style overrides.

2. Lightning overlay manager handles multiple instances of modals nicely without us worrying about managing the z-index of these modals.

### Cons
This implementation relies on the internal behavior of lightning alert and is subject to change.
