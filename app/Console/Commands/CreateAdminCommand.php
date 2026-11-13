<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

use function Laravel\Prompts\password;
use function Laravel\Prompts\text;

#[Signature('admin:create {--name= : The admin\'s name} {--email= : The admin\'s email address}')]
#[Description('Create the admin account that manages the website, or reset its password')]
class CreateAdminCommand extends Command
{
    /**
     * Execute the console command.
     *
     * The website has no public sign-up, so this is the only way to create a login.
     */
    public function handle(): int
    {
        $email = $this->option('email') ?: text('Email address', required: true, validate: ['email' => 'email']);
        $name = $this->option('name') ?: text('Name', default: 'Admin', required: true);
        $password = password('Password', required: true);

        $validator = Validator::make(
            ['email' => $email, 'password' => $password],
            ['email' => ['required', 'email', 'max:255'], 'password' => ['required', Password::defaults()]],
        );

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->components->error($error);
            }

            return self::FAILURE;
        }

        $user = User::updateOrCreate(['email' => $email], ['name' => $name, 'password' => $password]);
        $user->forceFill(['email_verified_at' => $user->email_verified_at ?? now()])->save();

        $this->components->info($user->wasRecentlyCreated
            ? "Admin account created for {$email}. Sign in at ".route('login')
            : "Password updated for {$email}.");

        return self::SUCCESS;
    }
}
