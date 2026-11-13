<?php

namespace App\Models;

use App\Support\PostBody;
use Database\Factories\PostFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $title
 * @property string $slug
 * @property string $body
 * @property string $thumbnail_path
 * @property-read string $thumbnail_url
 * @property-read string $body_html
 * @property-read string $excerpt
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['title', 'body', 'thumbnail_path'])]
class Post extends Model
{
    /** @use HasFactory<PostFactory> */
    use HasFactory;

    /**
     * Give each new post a unique slug based on its title. The slug never changes afterwards,
     * so links that were already shared or indexed keep working when the title is edited.
     */
    protected static function booted(): void
    {
        static::creating(function (Post $post): void {
            $post->slug ??= static::uniqueSlug($post->title);
        });

        static::deleted(function (Post $post): void {
            Storage::disk('public')->delete($post->thumbnail_path);
        });
    }

    /**
     * Make a slug from the title that no other post uses yet.
     */
    public static function uniqueSlug(string $title): string
    {
        $base = Str::slug($title) ?: 'post';
        $slug = $base;
        $suffix = 2;

        while (static::where('slug', $slug)->exists()) {
            $slug = $base.'-'.$suffix++;
        }

        return $slug;
    }

    /**
     * @return Attribute<string, never>
     */
    protected function thumbnailUrl(): Attribute
    {
        return Attribute::get(fn (): string => Storage::disk('public')->url($this->thumbnail_path));
    }

    /**
     * @return Attribute<string, never>
     */
    protected function bodyHtml(): Attribute
    {
        return Attribute::get(fn (): string => PostBody::toHtml($this->body));
    }

    /**
     * @return Attribute<string, never>
     */
    protected function excerpt(): Attribute
    {
        return Attribute::get(fn (): string => PostBody::excerpt($this->body));
    }
}
