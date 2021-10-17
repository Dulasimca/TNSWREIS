import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PathConstants } from '../Common-Modules/PathConstants';
import { RestAPIService } from './restAPI.service';

@Injectable({
    providedIn: 'root'
})

export class MasterService {
    masterData?: any = [];
    days?: any = [];
    data?: any = [];
    commodity?: any = [];

    constructor(private restApiService: RestAPIService) { }

    initializeMaster(): Observable<any[]> {
        this.restApiService.get(PathConstants.DaysMaster_Get).subscribe(res => {
            this.days = res;
        });
        this.restApiService.get(PathConstants.MasterAll_Get).subscribe(master => {
            this.data = master;
        })
        this.restApiService.get(PathConstants.CommodityMaster_Get).subscribe(commodity => {
            this.commodity = commodity;
        })
        // setTime
        // setTimeout(this.data = function () {
        //     return this.data;
        // }, 1000);
        return of(this.data, this.days, this.commodity);
    }

    getMaster(type): any {
        this.masterData = [];
        switch (type) {
            //district master
            case 'DT':
                this.data.Table.forEach(d => {
                    this.masterData.push({ name: d.DistrictName, code: d.Districtcode });
                })
                break;
            //taluk master
            case 'TK':
                this.data.Table1.forEach(t => {
                    this.masterData.push({ name: t.Talukname, code: t.Talukid, dcode: t.Districtcode });
                })
                break;
            //hostel type 
            case 'HT':
                this.data.Table2.forEach(h => {
                    this.masterData.push({ name: h.Name, code: h.HTypeId });
                })
                break;
            //gender master
            case 'GD':
                this.data.Table3.forEach(g => {
                    this.masterData.push({ name: g.Name, code: g.Id });
                })
                break;
            //unit master
            case 'UN':
                this.data.Table4.forEach(u => {
                    this.masterData.push({ name: u.Name, code: u.Id });
                })
                break;
            //accounting year
            case 'AY':
                this.data.Table5.forEach(a => {
                    this.masterData.push({ name: a.ShortYear, code: a.Id });
                })
                break;
            //commodity group
            case 'CG':
                this.data.Table6.forEach(c => {
                    this.masterData.push({ name: c.Name + '/' + c.NameTamil, code: c.Id });
                })
                break;
            //blood group 
            case 'BG':
                this.data.Table7.forEach(b => {
                    this.masterData.push({ name: b.Name, code: b.Id });
                })
                break;
            //caste master
            case 'CS':
                this.data.Table8.forEach(c => {
                    this.masterData.push({ name: c.Name, code: c.Id });
                })
                break;
            //religion master
            case 'RL':
                this.data.Table9.forEach(r => {
                    this.masterData.push({ name: r.Name, code: r.Id });
                })
                break;
            //mother tongue master
            case 'MT':
                this.data.Table10.forEach(m => {
                    this.masterData.push({ name: m.Name, code: m.Id });
                })
                break;
            //days master
            case 'FD':
                this.days.forEach(d => {
                    this.masterData.push({ name: d.Name + ' / ' + d.NameTamil, code: d.slno });
                })
                break;
            //course master
            case 'CU':
                this.data.Table11.forEach(u => {
                    this.masterData.push({ name: u.Name, code: u.Id });
                })
                break;
            //class master
            case 'CL':
                this.data.Table12.forEach(c => {
                    this.masterData.push({ name: c.Name, code: c.Id, type: c.Type });
                })
                break;
            //role master
            case 'RM':
                this.data.Table13.forEach(r => {
                    this.masterData.push({ name: r.Name, code: r.Id });
                })
                break;
            //commodity master
            case 'CM':
                this.commodity.forEach(c => {
                    this.masterData.push({ name: c.Name + '/' + c.NameTamil, code: c.Id });
                })
                break;
            //consumption type
            case 'CT':
                this.data.Table14.forEach(t => {
                    this.masterData.push({ name: t.Name, code: t.TypeId });
                })
                break;
        }
        return this.masterData;
    }
}