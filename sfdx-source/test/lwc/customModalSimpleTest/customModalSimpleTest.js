import { LightningElement, api } from 'lwc';
import CustomModal from 'c/customModal';

export default class CustomModalSimpleTest extends LightningElement {
    onClick(e) {
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
    }
}
