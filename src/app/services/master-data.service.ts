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
                if (this.data.Table !== undefined && this.data.Table !== null) {
                    this.data.Table.forEach(d => {
                        this.masterData.push({ name: d.DistrictName, code: d.Districtcode });
                    })
                } else {
                    this.masterData = [];
                }
                break;
            //taluk master
            case 'TK':
                if (this.data.Table1 !== undefined && this.data.Table1 !== null) {
                    this.data.Table1.forEach(t => {
                        this.masterData.push({ name: t.Talukname, code: t.Talukid, dcode: t.Districtcode });
                    })
                } else {
                    this.masterData = [];
                }
                break;
            //hostel type 
            case 'HT':
                if (this.data.Table2 !== undefined && this.data.Table2 !== null) {
                    this.data.Table2.forEach(h => {
                        this.masterData.push({ name: h.Name, code: h.HTypeId });
                    })
                } else {
                    this.masterData = [];
                }
                break;
            //gender master
            case 'GD':
                if (this.data.Table3 !== undefined && this.data.Table3 !== null) {
                    this.data.Table3.forEach(g => {
                        this.masterData.push({ name: g.Name, code: g.Id });
                    })
                } else {
                    this.masterData = [];
                }
                break;
            //unit master
            case 'UN':
                if (this.data.Table4 !== undefined && this.data.Table4 !== null) {
                    this.data.Table4.forEach(u => {
                        this.masterData.push({ name: u.Name, code: u.Id });
                    })
                } else {
                    this.masterData = [];
                }
                break;
            //accounting year
            case 'AY':
                if (this.data.Table5 !== undefined && this.data.Table5 !== null) {
                    this.data.Table5.forEach(a => {
                        this.masterData.push({ name: a.ShortYear, code: a.Id });
                    })
                } else {
                    this.masterData = [];
                }
                break;
            //commodity group
            case 'CG':
                if (this.data.Table6 !== undefined && this.data.Table6 !== null) {
                    this.data.Table6.forEach(c => {
                        this.masterData.push({ name: c.Name + '/' + c.NameTamil, code: c.Id });
                    })
                } else {
                    this.masterData = [];
                }
                break;
            //blood group 
            case 'BG':
                if (this.data.Table7 !== undefined && this.data.Table7 !== null) {
                    this.data.Table7.forEach(b => {
                        this.masterData.push({ name: b.Name, code: b.Id });
                    })
                } else {
                    this.masterData = [];
                }
                break;
            //caste master
            case 'CS':
                if (this.data.Table8 !== undefined && this.data.Table8 !== null) {
                    this.data.Table8.forEach(c => {
                        this.masterData.push({ name: c.Name, code: c.Id });
                    })
                } else {
                    this.masterData = [];
                }
                break;
            //religion master
            case 'RL':
                if (this.data.Table9 !== undefined && this.data.Table9 !== null) {
                    this.data.Table9.forEach(r => {
                        this.masterData.push({ name: r.Name, code: r.Id });
                    })
                } else {
                    this.masterData = [];
                }
                break;
            //mother tongue master
            case 'MT':
                if (this.data.Table10 !== undefined && this.data.Table10 !== null) {
                    this.data.Table10.forEach(m => {
                        this.masterData.push({ name: m.Name, code: m.Id });
                    })
                } else {
                    this.masterData = [];
                }
                break;
            //days master
            case 'FD':
                if (this.days !== undefined && this.days !== null) {
                    this.days.forEach(d => {
                        this.masterData.push({ name: d.Name + ' / ' + d.NameTamil, code: d.slno });
                    })
                } else {
                    this.masterData = [];
                }
                break;
            //course master
            case 'CU':
                if (this.data.Table11 !== undefined && this.data.Table11 !== null) {
                    this.data.Table11.forEach(u => {
                        this.masterData.push({ name: u.Name, code: u.Id });
                    })
                } else {
                    this.masterData = [];
                }
                break;
            //class master
            case 'CL':
                if (this.data.Table12 !== undefined && this.data.Table12 !== null) {
                    this.data.Table12.forEach(c => {
                        this.masterData.push({ name: c.Name, code: c.Id, type: c.Type });
                    })
                } else {
                    this.masterData = [];
                }
                break;
            //role master
            case 'RM':
                if (this.data.Table13 !== undefined && this.data.Table13 !== null) {
                    this.data.Table13.forEach(r => {
                        this.masterData.push({ name: r.Name, code: r.RoleId });
                    })
                } else {
                    this.masterData = [];
                }
                break;
            //commodity master
            case 'CM':
                if (this.commodity !== undefined && this.commodity !== null) {
                    this.commodity.forEach(c => {
                        this.masterData.push({ name: c.Name + '/' + c.NameTamil, code: c.Id });
                    })
                } else {
                    this.masterData = [];
                }
                break;
            //consumption type
            case 'CT':
                if (this.data.Table14 !== undefined && this.data.Table14 !== null) {
                    this.data.Table14.forEach(t => {
                        this.masterData.push({ name: t.Name, code: t.TypeId });
                    })
                } else {
                    this.masterData = [];
                }
                break;
        }
        return this.masterData;
    }
}