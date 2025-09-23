import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import Select from "../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";
import { isValidContact } from "../../lib/validation";

interface FormData {
  state: string;
  district: string;
  pincode: string;
  contact: string;
  feedback: string;
  proofImage: File | null;
  bloodGroup: string;
  units: string;
  urgency: string;
}

interface BloodRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const BloodRequestForm = ({ isOpen, onClose }: BloodRequestFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    state: "",
    district: "",
    pincode: "",
    contact: "",
    feedback: "",
    proofImage: null,
    bloodGroup: "",
    units: "",
    urgency: "",
  });

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const navigate = useNavigate();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});

  const validateForm = () => {
    const errors: Partial<FormData> = {};

    if (!formData.bloodGroup) {
      errors.bloodGroup = "Blood group is required";
    }
    if (!formData.units || Number(formData.units) < 1) {
      errors.units = "Units must be at least 1";
    }
    if (!formData.urgency) {
      errors.urgency = "Urgency level is required";
    }
    if (!formData.state) {
      errors.state = "State is required";
    }
    if (!formData.district) {
      errors.district = "District is required";
    }
    if (!formData.pincode) {
      errors.pincode = "Pin code is required";
    }
    if (!formData.contact) {
      errors.contact = "Contact information is required";
    } else if (!isValidContact(formData.contact)) {
      errors.contact = "Please enter a valid email or 10-digit phone number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setShowConfirmDialog(true);
    }
  };

  const handleConfirmSubmit = () => {
    localStorage.setItem("bloodRequestData", JSON.stringify(formData));
    setShowConfirmDialog(false);
    setIsFormSubmitted(true);
    onClose();
    navigate("/seeker/dashboard", { state: { formData } });
  };

  const handleDialogChange = (open: boolean) => {
    if (!isFormSubmitted && !open) {
      setShowWarning(true);
      return;
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto z-[1000] rounded-2xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-red-600">
            🩸 Raktsetu is always here for you
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Fill out the form below to request blood
          </DialogDescription>
        </DialogHeader>

        {showWarning && (
          <div className="mb-4 p-3 rounded-md bg-yellow-100 border border-yellow-400 text-yellow-700 text-sm">
            ⚠️ You must submit the blood request before leaving this page.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Blood Section */}
          <div className="border p-4 rounded-xl bg-red-50 shadow-sm">
            <h2 className="text-lg font-semibold text-red-700 mb-4">
              Need Blood
            </h2>

            <div>
              <Label htmlFor="bloodGroup">Blood Group</Label>
              <Select
                options={[
                  { label: "A+", value: "A+" },
                  { label: "A-", value: "A-" },
                  { label: "B+", value: "B+" },
                  { label: "B-", value: "B-" },
                  { label: "O+", value: "O+" },
                  { label: "O-", value: "O-" },
                  { label: "AB+", value: "AB+" },
                  { label: "AB-", value: "AB-" },
                ]}
                value={formData.bloodGroup}
                placeholder="Select blood group"
                onChange={(value: string) =>
                  handleSelectChange("bloodGroup", value)
                }
              />
              {formErrors.bloodGroup && (
                <p className="text-sm text-red-500 mt-1">
                  {formErrors.bloodGroup}
                </p>
              )}
            </div>

            <div className="mt-4">
              <Label htmlFor="units">Units Required</Label>
              <Input
                id="units"
                name="units"
                type="number"
                min="1"
                placeholder="Enter number of units"
                value={formData.units}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                required
              />
              {formErrors.units && (
                <p className="text-sm text-red-500 mt-1">
                  {formErrors.units}
                </p>
              )}
            </div>

            <div className="mt-4">
              <Label htmlFor="urgency">Urgency</Label>
              <Select
                options={[
                  { label: "Immediate", value: "Immediate" },
                  { label: "Within 24 hours", value: "Within 24 hours" },
                  { label: "Within 3 days", value: "Within 3 days" },
                ]}
                value={formData.urgency}
                placeholder="Select urgency level"
                onChange={(value: string) =>
                  handleSelectChange("urgency", value)
                }
              />
              {formErrors.urgency && (
                <p className="text-sm text-red-500 mt-1">
                  {formErrors.urgency}
                </p>
              )}
            </div>
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              name="state"
              placeholder="Enter your state"
              value={formData.state}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              required
            />
            {formErrors.state && (
              <p className="text-sm text-red-500 mt-1">{formErrors.state}</p>
            )}
          </div>

          <div>
            <Label htmlFor="district">District</Label>
            <Input
              id="district"
              name="district"
              placeholder="Enter your district"
              value={formData.district}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              required
            />
            {formErrors.district && (
              <p className="text-sm text-red-500 mt-1">
                {formErrors.district}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="pincode">Pin Code</Label>
            <Input
              id="pincode"
              name="pincode"
              type="number"
              placeholder="Enter your area pincode"
              value={formData.pincode}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              required
            />
            {formErrors.pincode && (
              <p className="text-sm text-red-500 mt-1">
                {formErrors.pincode}
              </p>
            )}
          </div>

          {/* Contact */}
          <div>
            <Label htmlFor="contact">Phone / Email</Label>
            <Input
              id="contact"
              name="contact"
              type="text"
              placeholder="Enter phone number or email"
              value={formData.contact}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              required
            />
            {formErrors.contact && (
              <p className="text-sm text-red-500 mt-1">
                {formErrors.contact}
              </p>
            )}
          </div>

          {/* File Upload */}
          <div>
            <Label htmlFor="proofImage">
              Upload Proof (blood bag or receipt)
            </Label>
            <Input
              id="proofImage"
              name="proofImage"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            />
            {formData.proofImage && (
              <p className="text-sm mt-2 text-gray-600">
                Selected: {formData.proofImage.name}
              </p>
            )}
          </div>

          {/* Feedback */}
          <div>
            <Label htmlFor="feedback">Description</Label>
            <Textarea
              id="feedback"
              name="feedback"
              placeholder="Share your experience..."
              value={formData.feedback}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-center">
            <Button
              type="submit"
              className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-700 shadow-md text-white font-medium transition"
            >
              Submit Request
            </Button>
          </div>
        </form>

        {/* Confirm Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Confirm Blood Request
              </h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to submit this blood request? Your request
                will be processed immediately.
              </p>
              <div className="space-y-4 py-4 border-t border-b">
                <div className="space-y-2 text-gray-700">
                  <h3 className="font-semibold">Request Details:</h3>
                  <p>
                    <span className="font-medium">Blood Group:</span>{" "}
                    {formData.bloodGroup}
                  </p>
                  <p>
                    <span className="font-medium">Units Required:</span>{" "}
                    {formData.units}
                  </p>
                  <p>
                    <span className="font-medium">Urgency:</span>{" "}
                    {formData.urgency}
                  </p>
                  <p>
                    <span className="font-medium">Location:</span>{" "}
                    {formData.district}, {formData.state}
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmDialog(false)}
                  className="rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md"
                  onClick={handleConfirmSubmit}
                >
                  Confirm Request
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BloodRequestForm;
