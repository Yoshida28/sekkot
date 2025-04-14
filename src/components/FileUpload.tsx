import React, { useEffect, useRef, useState } from 'react';
import { Upload, X, Check, Loader2, LogIn } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { Toaster, toast } from 'sonner';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

const FileUpload: React.FC<{
  onUploadComplete: (fileUrl: string, fileName: string) => void;
  onUploadStart?: () => void;
  disabled?: boolean;
}> = ({ onUploadComplete, onUploadStart, disabled = false }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedFormats = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.png', '.jpg', '.jpeg'];
  const maxSizeMB = 10;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const fileName = selectedFile.name.toLowerCase();
    const isValidFormat = acceptedFormats.some(format => 
      fileName.endsWith(format.toLowerCase())
    );

    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSizeMB}MB`);
      return;
    }
    if (!isValidFormat) {
      toast.error(`Unsupported file type. Supported: ${acceptedFormats.join(', ')}`);
      return;
    }
    setFile(selectedFile);
  };

  const handleUpload = async () => {
        if (!file) return;
      
        setIsUploading(true);
        onUploadStart?.();
      
        const fileExt = file.name.split('.').pop();
        const filePath = `uploads/${crypto.randomUUID()}.${fileExt}`;
      
        try {
          // No owner validation needed
          const { error } = await supabase.storage
            .from('client_uploads')
            .upload(filePath, file, {
              upsert: false,
              cacheControl: '3600',
            });
      
          if (error) throw error;
      
          const { data: { publicUrl } } = supabase.storage
            .from('client_uploads')
            .getPublicUrl(filePath);
      
          onUploadComplete(publicUrl, file.name);
          toast.success('File uploaded successfully!');
          setFile(null);
        } catch (err: any) {
          toast.error(err.message || 'Upload failed');
        } finally {
          setIsUploading(false);
        }
      };
  return (
    <div className="mb-6">
      <div className="border-2 border-dashed border-purple-900 rounded-lg p-6 text-center bg-black/50">
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          onChange={handleFileChange}
          disabled={disabled || isUploading}
          className="hidden"
        />
        {!file ? (
          <div 
            onClick={() => !disabled && !isUploading && fileInputRef.current?.click()} 
            className={`cursor-pointer ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Upload className="mx-auto h-10 w-10 text-purple-400 mb-2" />
            <p className="text-purple-200">Drop your file here or click to upload</p>
            <p className="text-sm text-purple-400 mt-1">
              Supported: {acceptedFormats.join(', ')} • Max size: {maxSizeMB}MB
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-purple-900/30 rounded-lg p-3 border border-purple-800">
              <span className="text-purple-200 truncate">{file.name}</span>
              <button
                onClick={() => setFile(null)}
                className="text-purple-400 hover:text-purple-200"
                disabled={isUploading}
              >
                <X size={18} />
              </button>
            </div>
            <button
              onClick={handleUpload}
              disabled={disabled || isUploading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg flex items-center justify-center disabled:bg-purple-800 disabled:cursor-not-allowed"
            >
              {isUploading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Upload File'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const RequirementSubmissionFormWithAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [description, setDescription] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [uploadInProgress, setUploadInProgress] = useState(false);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) {
      toast.error('Sign in failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      toast.error('Please enter a description');
      return;
    }
    
    if (!fileUrl) {
      toast.error('Please upload a file');
      return;
    }
    
    if (uploadInProgress) {
      toast.error('Please wait for file upload to complete');
      return;
    }

    // Check if user is authenticated
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    
    if (!currentUser) {
      setNeedsAuth(true);
      return;
    }

    setUser(currentUser);
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('client_requirements')  // Updated table name
        .insert({
          description,
          file_url: fileUrl,
          file_name: fileName,
          user_id: currentUser.id,
          user_email: currentUser.email,
          status: 'pending'
        });

      if (error) throw error;

      setSubmitSuccess(true);
      toast.success('Requirement submitted successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="max-w-md mx-auto p-6 bg-black rounded-lg text-center border border-purple-900">
        <Check className="mx-auto h-12 w-12 text-purple-500 mb-4" />
        <h2 className="text-xl font-semibold text-purple-300 mb-2">Submission Successful</h2>
        <p className="text-purple-400 mb-6">Your requirement has been submitted.</p>
        <button
          onClick={() => {
            setSubmitSuccess(false);
            setDescription('');
            setFileUrl('');
            setFileName('');
            setNeedsAuth(false);
          }}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg"
        >
          Submit Another Requirement
        </button>
      </div>
    );
  }

  if (needsAuth) {
    return (
      <div className="max-w-md mx-auto p-6 text-center bg-black border border-purple-900 rounded-lg">
        <Toaster position="top-right" richColors />
        <h1 className="text-xl text-purple-300 font-semibold mb-4">Sign in to Submit</h1>
        <p className="text-purple-400 mb-4">You need to sign in to submit your requirement.</p>
        <button
          onClick={signInWithGoogle}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg flex items-center justify-center"
        >
          <LogIn className="mr-2" /> Sign in with Google
        </button>
        <button
          onClick={() => setNeedsAuth(false)}
          className="mt-4 text-purple-400 hover:text-purple-300 text-sm"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-black rounded-lg border border-purple-900">
      <Toaster position="top-right" richColors />
      <h1 className="text-2xl font-semibold text-purple-300 mb-6">Submit Your Requirement</h1>

      <form onSubmit={handleSubmit}>
        <FileUpload
          onUploadComplete={(url, name) => {
            setFileUrl(url);
            setFileName(name);
            setUploadInProgress(false);
          }}
          onUploadStart={() => setUploadInProgress(true)}
          disabled={isSubmitting}
        />

        <div className="mb-6">
          <label className="block text-purple-300 mb-2">
            Requirement Description <span className="text-purple-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-black text-purple-200 rounded-lg p-3 border border-purple-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            rows={5}
            placeholder="Describe your requirement in detail..."
            required
            disabled={isSubmitting}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !fileUrl || !description.trim() || uploadInProgress}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium disabled:bg-purple-800 disabled:cursor-not-allowed"
        >
          {isSubmitting || uploadInProgress ? (
            <Loader2 className="animate-spin mx-auto h-5 w-5" />
          ) : (
            'Submit Requirement'
          )}
        </button>
      </form>
    </div>
  );
};

export default RequirementSubmissionFormWithAuth;