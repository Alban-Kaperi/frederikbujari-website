<?php

namespace App\Support;

use GdImage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;

/**
 * Turns an uploaded image into a WebP file that is at most 1200px wide, and stores it.
 */
class ThumbnailImage
{
    public const MAX_WIDTH = 1200;

    public const QUALITY = 90;

    /**
     * Convert the upload and store it on the public disk. Returns the stored path.
     */
    public static function store(UploadedFile $file, string $directory = 'posts'): string
    {
        $image = imagecreatefromstring((string) file_get_contents($file->getRealPath()))
            ?: throw new RuntimeException('The uploaded file is not a readable image.');

        $image = self::applyExifOrientation($image, $file);
        $image = self::scaleDown($image);

        imagepalettetotruecolor($image);
        imagealphablending($image, false);
        imagesavealpha($image, true);

        ob_start();
        imagewebp($image, null, self::QUALITY);
        $contents = (string) ob_get_clean();

        $path = $directory.'/'.Str::uuid().'.webp';
        Storage::disk('public')->put($path, $contents);

        return $path;
    }

    /**
     * Rotate photos taken on a phone so they are stored the right way up.
     */
    private static function applyExifOrientation(GdImage $image, UploadedFile $file): GdImage
    {
        if (! in_array($file->getMimeType(), ['image/jpeg'], true) || ! function_exists('exif_read_data')) {
            return $image;
        }

        $exif = @exif_read_data($file->getRealPath());
        $orientation = is_array($exif) ? ($exif['Orientation'] ?? 1) : 1;
        $angle = [3 => 180, 6 => -90, 8 => 90][$orientation] ?? 0;

        return $angle === 0 ? $image : (imagerotate($image, $angle, 0) ?: $image);
    }

    private static function scaleDown(GdImage $image): GdImage
    {
        if (imagesx($image) <= self::MAX_WIDTH) {
            return $image;
        }

        return imagescale($image, self::MAX_WIDTH, -1, IMG_BICUBIC) ?: $image;
    }
}
