<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Token extends Model
{
    use HasFactory;

    protected $primaryKey = 'id';
    protected $table = 'tokens';
    protected $fillable = array(
        'user_id',
        'value',
        'jti',
        'type',
        'pair',
        'status',
        'payload'
    );

    protected $casts = [
        'payload' => 'array'
    ];

    function user() {
        return $this->belongsTo('App\Models\User');
    }
}
