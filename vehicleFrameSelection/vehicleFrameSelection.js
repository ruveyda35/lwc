import { LightningElement, track, api ,wire} from 'lwc';
import getVehicleFrames from '@salesforce/apex/VehicleFrameController.getVehicleFrames';
import linkFramesToOpportunity from '@salesforce/apex/VehicleFrameController.linkFramesToOpportunity';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CloseActionScreenEvent } from "lightning/actions";


export default class VehicleFrameSelection extends LightningElement {
  columns = [
    { label: 'SerialNumber', fieldName: 'SerialNumber' },
    { label: 'Vehicle Color', fieldName: 'Exterior_Color__c' },
    { label: 'Vehicle Inner Color', fieldName: 'Interior_Color__c' },
    { label: 'Product', fieldName: 'Product2.Name', type: 'text', relationshipName: 'Product' },
  ];
  
  
  data = [];
  @api recordId;
  @track vehicleFrames; 
  @track selectedRows = [];
  @track relatedObjectName;
  
 

    @wire(getVehicleFrames)
    wiredVehicleFrames({ error, data }) {
      if (data) {
        this.vehicleFrames = data;
        this.vehicleFrames =  data.map(
          record => Object.assign(
          { "Product2.Name": record.Product2.Name},
          record
            )
          );
      } else if (error) {
        // Handle error
      }
    } 

    linkSelection() {
    this.selectedRows =  this.template.querySelector("lightning-datatable").getSelectedRows();
    linkFramesToOpportunity({ opportunityId: this.recordId, selectedFrames: this.selectedRows })
      .then(result => {
        this.showSuccessMessage('Success!', 'Linking frames to opportunity was successful.');
        this.dispatchEvent(new CloseActionScreenEvent());
  })
      .catch(error => {
        // Handle error
      });
  }
  showSuccessMessage(title, message) {
    const event = new ShowToastEvent({
        title: title,
        message: message,
        variant: 'success'
    });
    this.dispatchEvent(event);
}

}