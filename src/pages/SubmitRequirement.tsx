import React, { useState } from 'react';
import { Upload, X, Check } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const SubmitRequirement = () => {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `requirements/${fileName}`;

        // Upload file to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('requirements')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Store requirement in database
        const { error: dbError } = await supabase
          .from('requirements')
          .insert([
            {
              description,
              file_path: filePath,
              file_name: file.name,
              status: 'new'
            }
          ]);

        if (dbError) throw dbError;

        setSubmitStatus('success');
        setFile(null);
        setDescription('');
      }
    } catch (error) {
      console.error('Error submitting requirement:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-purple-300 text-center mb-12">
          Submit Your Requirement
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* File Upload */}
          <div className="relative border-2 border-dashed border-purple-900 rounded-xl p-8 text-center hover:border-purple-500 transition-all duration-300">
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.xlsx,.xls,.doc,.docx,.png,.jpg,.jpeg"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="space-y-4">
              <Upload className="mx-auto h-12 w-12 text-purple-400" />
              <div className="text-purple-200">
                {file ? (
                  <div className="flex items-center justify-center gap-2">
                    <span>{file.name}</span>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-lg font-medium">
                      Drop your file here or click to upload
                    </p>
                    <p className="text-sm text-gray-400">
                      Supports PDF, Excel, Word, and image files
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-purple-200 text-sm font-medium mb-2">
              Requirement Description
            </label>
            <textarea
              id="description"
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-900 border border-purple-900 rounded-lg p-4 text-white focus:outline-none focus:border-purple-500 transition-colors duration-300"
              placeholder="Please describe your requirements in detail..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !file || !description}
            className={`w-full py-4 rounded-lg text-white font-medium transition-all duration-300 
              ${isSubmitting 
                ? 'bg-purple-800 cursor-not-allowed' 
                : 'bg-purple-600 hover:bg-purple-700'}`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Requirement'}
          </button>

          {/* Status Message */}
          {submitStatus === 'success' && (
            <div className="flex items-center justify-center gap-2 text-green-400">
              <Check size={20} />
              <span>Requirement submitted successfully!</span>
            </div>
          )}
          {submitStatus === 'error' && (
            <div className="flex items-center justify-center gap-2 text-red-400">
              <X size={20} />
              <span>Error submitting requirement. Please try again.</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SubmitRequirement;