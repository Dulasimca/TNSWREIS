export interface Registration {
 //   constructor() {}
    studentId: number;
    hostelId: number;
    studentName: string;
    age: number;
    dob: any;
    bloodGroup: number;
    gender: number;
    motherTongue: number;
    mobileNo: string;
    altMobNo: string;
    religion: number;
    caste: number;
    subCaste: number;
    studentFilename: string;
    instituteName: string;
    currentInstituteId: number;
    currentInstituteInfo: any;
    medium: number;
    classId: number;
    courseYearId: number;
    courseTitle: string;
    instituteInfo: any;
    lastStudiedInstituteCode: string;
    lastStudiedInstituteAddress: string;
    distanceFromHostelToHome: number;
    distanceFromHostelToInstitute: number;
    disabilityType: any;
    address1: string;
    address2: string;
    landmark: string;
    distrctCode: number;
    talukCode: number;
    village: string;
    pincode: number;
    aadharNo: string;
    rationCardrNo: string;
    emisno: any;
    talukApproval: any;
    districtApproval: any;
    admissionNo: string;
    remarks: string;
    scholarshipId: any;
    refugeeSelectedType: number;
    refugeeId: string;
    //bank
    bankId: number;
    bankName: string;
    bankAccNo: string;
    ifscCode: string;
    branchName: string;
    micrNo: string;
    //parent's info
    parentId: number;
    fatherName: string;
    fatherOccupation: string;
    fatherMoileNo: string;
    fatherQualification: string;
    fatherYIncome: any;
    motherName: string;
    motherOccupation: string;
    motherMoileNo: string;
    motherQualification: string;
    motherYIncome: any;
    guardianName: string;
    guardianOccupation: string;
    guardianMobileNo: string;
    guardianQualification: string;
    totalYIncome: number;
    fnTitleCode: number;
    mnTitleCode: number;
    gnTitleCode: number;
    
    //doc
    documentId: number;
    incomeCertificateFilename: string;
    tcFilename: string;
    bankPassbookFilename: string;
    declarationFilename: string;
}