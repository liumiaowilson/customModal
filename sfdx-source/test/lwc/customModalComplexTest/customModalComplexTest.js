import { LightningElement, api } from 'lwc';
import custom from './custom.html';
import CustomModal from 'c/customModal';

export default class CustomModalComplexTest extends LightningElement {
    onClick(e) {
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
    }
}
