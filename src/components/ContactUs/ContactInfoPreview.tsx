import {
  Clock,
  Facebook,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
  Instagram,
  Link as LinkIcon,
} from 'lucide-react';
import React from 'react';
import { type ContactInfoFormData } from './types';

const getSocialIcon = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes('facebook')) return <Facebook className="w-5 h-5" />;
  if (p.includes('linkedin')) return <Linkedin className="w-5 h-5" />;
  if (p.includes('twitter') || p === 'x')
    return <Twitter className="w-5 h-5" />;
  if (p.includes('youtube')) return <Youtube className="w-5 h-5" />;
  if (p.includes('instagram')) return <Instagram className="w-5 h-5" />;
  return <LinkIcon className="w-5 h-5" />;
};

const getSocialBgColor = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes('facebook')) return 'bg-blue-600 hover:bg-blue-700';
  if (p.includes('linkedin')) return 'bg-blue-700 hover:bg-blue-800';
  if (p.includes('twitter') || p === 'x') return 'bg-sky-500 hover:bg-sky-600';
  if (p.includes('youtube')) return 'bg-red-600 hover:bg-red-700';
  if (p.includes('instagram')) return 'bg-pink-600 hover:bg-pink-700';
  return 'bg-gray-600 hover:bg-gray-700';
};

interface ContactInfoPreviewProps {
  formData: ContactInfoFormData;
}

const ContactInfoPreview: React.FC<ContactInfoPreviewProps> = ({
  formData,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {formData.backgroundImage && (
        <div className="relative h-64 w-full">
          <img
            src={
              formData.backgroundImage.preview ||
              formData.backgroundImage.url ||
              ''
            }
            alt="Contact Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/50" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h1 className="text-4xl font-bold text-white mb-2">Contact Us</h1>
            <p className="text-white/90">Get in touch with our team</p>
          </div>
        </div>
      )}

      <div className="p-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Contact Information
            </h2>

            {formData.address && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Address</h3>
                  <p className="text-gray-600">{formData.address}</p>
                </div>
              </div>
            )}

            {formData.email && (
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <a
                    href={`mailto:${formData.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {formData.email}
                  </a>
                </div>
              </div>
            )}

            {formData.phone && (
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Phone</h3>
                  <a
                    href={`tel:${formData.phone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {formData.phone}
                  </a>
                </div>
              </div>
            )}

            {Object.values(formData.socialMedia).some(Boolean) && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Follow Us</h3>
                <div className="flex gap-3 flex-wrap">
                  {Object.entries(formData.socialMedia).map(
                    ([platform, value]) => {
                      if (!value) return null;
                      return (
                        <a
                          key={platform}
                          href={value}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`p-2 text-white rounded-lg transition-colors ${getSocialBgColor(platform)}`}
                          title={platform}
                        >
                          {getSocialIcon(platform)}
                        </a>
                      );
                    },
                  )}
                </div>
              </div>
            )}
          </div>

          {formData.workingHours.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-blue-600" />
                Working Hours
              </h2>
              <div className="space-y-3">
                {formData.workingHours.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="font-medium text-gray-900">
                      {item.day}
                    </span>
                    <span className="text-gray-600">{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactInfoPreview;
