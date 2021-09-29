<?php
/*
Plugin Name: Site Plugin for Element SaaS
description: Site specific code for Element SaaS
Version: 1.0
Author: Brian Austgen
*/

function include_js_cookie() {
  wp_enqueue_script('js-cookie', 'https://cdn.jsdelivr.net/npm/js-cookie@beta/dist/js.cookie.min.js', array(), null, true);
}


// Powers the calculator pages.
function add_cal_script() {
  if(is_page('warrant-calculator')) {
    wp_enqueue_script('chart-js', 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.bundle.min.js', array(), null, true);
    wp_enqueue_script( 'warrant-calculator', plugin_dir_url(__FILE__) . 'js/warrant-calculator.js', array ( 'jquery', 'chart-js' ), false, true);
  }
  if(is_page('equity-calculator')) {
    wp_enqueue_script('chart-js', 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.bundle.min.js', array(), null, true);
    wp_enqueue_script( 'equity-calculator', plugin_dir_url(__FILE__) . 'js/equity-calculator.js', array ( 'jquery', 'chart-js' ), false, true);
  }
  if(is_page('percentage-of-revenue-calculator')) {
    wp_enqueue_script('chart-js', 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.bundle.min.js', array(), null, true);
    wp_enqueue_script('finance-js', 'https://cdn.jsdelivr.net/npm/financejs@4.1.0/finance.min.js', array(), null, true);
    wp_enqueue_script( 'percentage-of-revenue-calculator', plugin_dir_url(__FILE__) . 'js/percentage-of-revenue-calculator.js', array ( 'jquery', 'chart-js', 'finance-js' ), false, true);
  }
  if(is_page('interest-rate-calculator')) {
    wp_enqueue_script( 'interest-rate-calculator', plugin_dir_url(__FILE__) . 'js/interest-rate-calculator.js', array ( 'jquery' ), false, true);
  }
}

// Allows parameters to be passed to forms from cookies and the url.
function add_parameter_tracking_script() {
  wp_enqueue_script( 'parameter-tracking', plugin_dir_url(__FILE__) . 'js/parameter-tracking.js', array ( 'jquery', 'js-cookie' ), false, true);
}


function terms_post_type() {
  $labels = array(
    'name'               => _x( 'Terms', 'post type general name' ),
    'singular_name'      => _x( 'Term', 'post type singular name' ),
    'add_new'            => _x( 'Add New', 'book' ),
    'add_new_item'       => __( 'Add New Term' ),
    'edit_item'          => __( 'Edit Term' ),
    'new_item'           => __( 'New Term' ),
    'all_items'          => __( 'All Terms' ),
    'view_item'          => __( 'View Term' ),
    'search_items'       => __( 'Search Terms' ),
    'not_found'          => __( 'No terms found' ),
    'not_found_in_trash' => __( 'No terms found in the Trash' ),
    'menu_name'          => 'Terms'
  );
  $args = array(
    'labels'        => $labels,
    'description'   => 'Holds explanations of common finance terms relevant to SaaS companies',
    'public'        => true,
    'menu_position' => 5,
    'supports'      => array( 'title', 'editor', 'thumbnail', 'excerpt', 'comments' ),
    'has_archive'   => true,
  );
  register_post_type( 'term', $args );
}

function newsletter_post_type() {
  $labels = array(
    'name'               => _x( 'Newsletters', 'post type general name' ),
    'singular_name'      => _x( 'Newsletter', 'post type singular name' ),
    'add_new'            => _x( 'Add New', 'book' ),
    'add_new_item'       => __( 'Add New Newsletter' ),
    'edit_item'          => __( 'Edit Newsletter' ),
    'new_item'           => __( 'New Newsletter' ),
    'all_items'          => __( 'All Newsletters' ),
    'view_item'          => __( 'View Newsletter' ),
    'search_items'       => __( 'Search Newsletters' ),
    'not_found'          => __( 'No newsletters found' ),
    'not_found_in_trash' => __( 'No newsletters found in the Trash' ),
    'menu_name'          => 'Newsletters'
  );
  $args = array(
    'labels'        => $labels,
    'description'   => 'Newsletters of months past',
    'public'        => true,
    'menu_position' => 5,
    'supports'      => array( 'title', 'editor', 'thumbnail', 'excerpt', 'comments' ),
    'has_archive'   => true,
  );
  register_post_type( 'newsletter', $args );
}

add_action( 'init', 'newsletter_post_type' );
add_action( 'init', 'terms_post_type' );

add_action('wp_enqueue_scripts', 'include_js_cookie');
add_action('wp_enqueue_scripts', 'add_parameter_tracking_script');
add_action('wp_enqueue_scripts', 'add_cal_script');
