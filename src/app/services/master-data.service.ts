import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class MasterService {
    masterData?: any = [];

    getMaster(type): any {
        this.masterData = [];
        switch (type) {
            case 'G':
                this.masterData = [
                    { label: '-select-', value: null },
                    { label: 'Female', value: 'Female' },
                    { label: 'Male', value: 'Male' },
                    { label: 'Transgender', value: 'Transgender' },
                ];
                break;
            case 'B':
                this.masterData = [
                    { label: '-select-', value: null },
                    { label: 'A+', value: 'A+' },
                    { label: 'A-', value: 'A-' },
                    { label: 'AB+', value: 'AB+' },
                    { label: 'AB-', value: 'AB-' },
                    { label: 'B+', value: 'B+' },
                    { label: 'B-', value: 'B-' },
                    { label: 'O+', value: 'O+' },
                    { label: 'O-', value: 'O-' },
                ];
                break;
            case 'MT':
                this.masterData = [
                    { label: '-select-', value: null },
                    { label: 'Tamil', value: 'Tamil' },
                    { label: 'English', value: 'English' },
                    { label: 'Others', value: "Others" },
                ];
                break;
        }
    }
}