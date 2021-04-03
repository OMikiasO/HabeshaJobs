package com.chaosapps.habeshajobs;
import android.os.Bundle; // here
import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */

  @Override
  protected void onCreate(Bundle savedInstanceState) {
      setTheme(R.style.AppTheme);
      super.onCreate(savedInstanceState);
  }

  @Override
  protected String getMainComponentName() {
    return "Habesha";
  }
}