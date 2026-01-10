export interface PriceConcept {
    id: string;
    name: string;
    amount: number;
}

export interface TechnicalSpec {
    id: string;
    name: string;
    value: string;
}

export interface LayoutConfig {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface Product {
    id: string;
    name: string;
    model: string;
    images: string[];
    specs: TechnicalSpec[];
    concepts: PriceConcept[];
    margin: number; // percent value
    layout?: LayoutConfig;
}

// Legacy type alias for backwards compatibility
export type Door = Product;
export type DoorSpecs = TechnicalSpec[];

export interface ClientInfo {
    name: string;
    address: string;
    phone: string;
    companyName?: string;
    validityText?: string;
    installationText?: string;
    taxText?: string;
}
