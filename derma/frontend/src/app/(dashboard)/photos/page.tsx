'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { usePhotos, Photo } from '@/hooks/usePhotos';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Camera, Image, Search, Loader2, Eye, Tag } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';

const BODY_REGIONS = [
  'face', 'neck', 'scalp', 'chest', 'back', 'arms', 'legs', 'hands', 'feet',
  'forehead', 'cheeks', 'chin', 'nose', 'periorbital',
];

export default function PhotosPage() {
  const { hasRole } = useAuthStore();
  const canUpload = hasRole(['OWNER', 'ADMIN', 'DOCTOR', 'NURSE']);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [bodyRegionFilter, setBodyRegionFilter] = useState('');
  const [visitIdFilter, setVisitIdFilter] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, error } = usePhotos({
    search: debouncedSearch || undefined,
    page,
    perPage: 20,
    bodyRegion: bodyRegionFilter || undefined,
    visitId: visitIdFilter || undefined,
    sortBy: 'captureDate',
    sortOrder: 'desc',
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Clinical Photos</h1>
            <p className="text-muted-foreground">Manage clinical photography</p>
          </div>
        </div>
        <Card>
          <CardContent className="py-8 text-center text-red-500">
            Failed to load photos. Please try again.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clinical Photos</h1>
          <p className="text-muted-foreground">Manage clinical photography</p>
        </div>
        {canUpload && (
          <Button onClick={() => alert('Upload Photo - Navigate to /photos/upload')}>
            <Camera className="mr-2 h-4 w-4" /> Upload Photo
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle>Photo Gallery</CardTitle>
            <div className="flex items-center gap-4 flex-wrap">
              <Input
                placeholder="Search photos..."
                className="w-64"
                value={search}
                onChange={handleSearch}
                disabled={isLoading}
              />
              <Select value={bodyRegionFilter} onValueChange={setBodyRegionFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Body Regions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Body Regions</SelectItem>
                  {BODY_REGIONS.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region.charAt(0).toUpperCase() + region.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {data?.data.map((photo: Photo) => (
                <div key={photo.id} className="group relative border rounded-lg overflow-hidden bg-muted/50">
                  <div className="aspect-square relative overflow-hidden">
                    {photo.thumbnailSignedUrl ? (
                      <img
                        src={photo.thumbnailSignedUrl}
                        alt={photo.originalFilename}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <Image className="h-12 w-12 text-muted-foreground/50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => alert(`View photo ${photo.id}`)}>
                        <Eye className="h-5 w-5 text-white" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-2 space-y-1">
                    <p className="text-xs font-medium truncate">{photo.originalFilename}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(photo.captureDate)}</p>
                    <div className="flex items-center gap-1 flex-wrap">
                      <Tag className="h-4 px-2 text-xs" />
                      <span className="text-xs text-muted-foreground capitalize">{photo.bodyRegion}</span>
                      {photo.bodySubRegion && (
                        <>
                          <span className="text-xs text-muted-foreground">/</span>
                          <span className="text-xs text-muted-foreground capitalize">{photo.bodySubRegion}</span>
                        </>
                      )}
                    </div>
                    {photo.visit && (
                      <p className="text-xs text-muted-foreground">Visit: {photo.visit.visitNumber}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {data && data.meta.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Page {data.meta.page} of {data.meta.totalPages} ({data.meta.total} total)
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={data.meta.page === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={data.meta.page === data.meta.totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}