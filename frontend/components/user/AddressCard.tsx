/* START OF FILE frontend/components/user/AddressCard.tsx */
// File: frontend/components/user/AddressCard.tsx
// Task IDs: Implied by FE-BL-007/CP.1 (need to display addresses)
// Description: Displays a single saved address with options to edit/delete.
// Status: Revised - Added comment placeholder for country name mapping (B.4).

import React from "react";
import { Address } from "@/types/user";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Edit, Trash2 } from "lucide-react";

interface AddressCardProps {
  address: Address;
  onEdit: (addressId: string) => void;
  onDelete: (addressId: string) => void;
  isDefaultShipping?: boolean;
  isDefaultBilling?: boolean;
}

/**
 * Displays a single address entry in a card format.
 * Provides buttons for editing and deleting the address.
 */
const AddressCard: React.FC<AddressCardProps> = ({
  address,
  onEdit,
  onDelete,
  isDefaultShipping = false,
  isDefaultBilling = false,
}) => {
  const {
    id,
    first_name,
    last_name,
    company,
    address_1,
    address_2,
    city,
    province,
    postal_code,
    country_code,
    phone,
  } = address;

  const handleEdit = () => onEdit(id);
  const handleDelete = () => onDelete(id);

  // Consider mapping country_code to full name using a utility function post-MVP (B.4)
  // const countryName = getCountryName(country_code);

  return (
    <Card data-testid={`address-card-${id}`}>
      <CardHeader>
        <CardTitle className="text-lg">
          {first_name} {last_name}
          {(isDefaultShipping || isDefaultBilling) && (
            <span className="ml-2 text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded">
              {isDefaultShipping && isDefaultBilling
                ? "Default Shipping & Billing"
                : isDefaultShipping
                ? "Default Shipping"
                : "Default Billing"}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 text-sm text-muted-foreground">
        {company && <p>{company}</p>}
        <p>{address_1}</p>
        {address_2 && <p>{address_2}</p>}
        <p>
          {city}, {province} {postal_code}
        </p>
        {/* Display full country name post-MVP instead of just code (B.4) */}
        <p>{country_code?.toUpperCase()}</p>
        {phone && <p>{phone}</p>}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleEdit}
          aria-label={`Edit address for ${first_name} ${last_name}`}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={handleDelete}
          aria-label={`Delete address for ${first_name} ${last_name}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AddressCard;
/* END OF FILE frontend/components/user/AddressCard.tsx */
