export interface MonthValue { 
    month: string; 
    value: number; 
}

export interface SubCategory { 
    id: string; 
    name: string; 
    values: MonthValue[] 
}

export interface ParentCategory { 
    id: string; 
    type: 'income' | 'expense'; 
    name: string; 
    subCategories: SubCategory[] 
}