<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateApiTable extends Migration {

	public function up()
	{
		Schema::create('api', function(Blueprint $table) {
			$table->increments('id');
			$table->timestamps();
			$table->string('name', 100);
			$table->string('token', 2000)->nullable();
			$table->string('auth_url', 2083)->nullable();
			$table->string('client_id', 1000)->nullable();
			$table->string('client_secret', 2000)->nullable();
		});
	}

	public function down()
	{
		Schema::drop('api');
	}
}