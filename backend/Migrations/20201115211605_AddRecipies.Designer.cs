﻿// <auto-generated />
using Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Api.Migrations
{
    [DbContext(typeof(DBContext))]
    [Migration("20201115211605_AddRecipies")]
    partial class AddRecipies
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "3.1.10")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("Api.Models.Recipe", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int>("Fat")
                        .HasColumnType("int(10)");

                    b.Property<string>("Name")
                        .HasColumnType("varchar(30)");

                    b.HasKey("Id");

                    b.ToTable("Recipies");
                });
#pragma warning restore 612, 618
        }
    }
}
