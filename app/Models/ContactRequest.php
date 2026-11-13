<?php

namespace App\Models;

use Database\Factories\ContactRequestFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string $message
 * @property string $locale
 * @property Carbon|null $read_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'email', 'message', 'locale'])]
class ContactRequest extends Model
{
    /** @use HasFactory<ContactRequestFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'read_at' => 'datetime',
        ];
    }

    /**
     * Only requests the admin has not opened yet.
     *
     * @param  Builder<ContactRequest>  $query
     */
    #[Scope]
    protected function unread(Builder $query): void
    {
        $query->whereNull('read_at');
    }

    /**
     * Get the request as shown in the admin area.
     *
     * @return array{id: int, name: string, email: string, message: string, locale: string, isRead: bool, receivedAt: string, receivedAgo: string}
     */
    public function toAdminArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'message' => $this->message,
            'locale' => $this->locale,
            'isRead' => $this->read_at !== null,
            'receivedAt' => $this->created_at->isoFormat('D MMM YYYY, HH:mm'),
            'receivedAgo' => $this->created_at->diffForHumans(),
        ];
    }
}
