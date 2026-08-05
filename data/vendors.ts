export type VendorId = "ch-sistemas" | "secullum";

export type Vendor = {
  id: VendorId;
  name: string;
  logo: string;
  logoAlt: string;
  website: string;
  tagline: string;
};

export const vendors: Record<VendorId, Vendor> = {
  "ch-sistemas": {
    id: "ch-sistemas",
    name: "CH Sistemas",
    logo: "/brand/partners/ch-sistemas.svg",
    logoAlt: "CH Sistemas",
    website: "https://chsistemas.com.br",
    tagline: "Revenda oficial CH Sistemas",
  },
  secullum: {
    id: "secullum",
    name: "Secullum",
    logo: "/brand/partners/secullum.svg",
    logoAlt: "Secullum",
    website: "https://www.secullum.com.br",
    tagline: "Representante autorizado Secullum",
  },
};

export function getVendor(id: VendorId): Vendor {
  return vendors[id];
}
