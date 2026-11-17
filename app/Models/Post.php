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
 * @property array<string, array{title: string, body: string}>|null $translations
 * @property string $thumbnail_path
 * @property-read string $thumbnail_url
 * @property Carbon $created_at
 * @property Carbon $updated_at
 */
#[Fillable(['title', 'body', 'translations', 'thumbnail_path'])]
class Post extends Model
{
    /** @use HasFactory<PostFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['translations' => 'array'];
    }

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
     * The title and text in a language. The default language is stored on the post itself;
     * a language without a translation falls back to it.
     *
     * @return array{title: string, body: string}
     */
    public function contentFor(string $locale): array
    {
        if ($locale !== config('site.locales')[0] && isset($this->translations[$locale])) {
            return $this->translations[$locale];
        }

        return ['title' => $this->title, 'body' => $this->body];
    }

    public function titleFor(string $locale): string
    {
        return $this->contentFor($locale)['title'];
    }

    public function bodyHtmlFor(string $locale): string
    {
        return PostBody::toHtml($this->contentFor($locale)['body']);
    }

    public function excerptFor(string $locale): string
    {
        return PostBody::excerpt($this->contentFor($locale)['body']);
    }
}
