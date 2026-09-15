export type Area = {
  id: string;
  slug: string;
  name: string;
  description: string;
  points: string[];
  icon: string;
  visible: boolean;
  sort_order: number;
};

export type Abogado = {
  id: string;
  name: string;
  cedula: string;
  rol: string;
  bio: string;
  visible: boolean;
  sort_order: number;
};

export type SiteSettings = {
  brand_name: string;
  tagline: string;
  city: string;
  whatsapp_number: string;
  phone_display: string;
  whatsapp_message: string;
  email: string;
  address: string;
  hours: string;
  slogan: string;
  footer_text: string;
  maps_url: string;
};
